// modules/Api/firebase/rides.dao.ts
import type { IRideRepository } from '@/core/interfaces/IRideRepository';
import { RideEntity } from '@/core/entities/Ride';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
  orderBy,
  limit as fbLimit,
  startAfter,
  getCountFromServer,
  FirebaseFirestoreTypes,
  onSnapshot,
} from '@react-native-firebase/firestore';
import { db } from '@/config/firebase.config';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';
import { generateId } from '@/helpers/generateId';
import { generateOTP } from '@/helpers/generateOTP';

export class FirebaseRideDAO implements IRideRepository {
  private ridesRef = collection(db, firebaseCollections.rides.root);

  // Remove campos undefined antes de salvar
  private sanitize<T extends Record<string, any>>(data: T): T {
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null),
    ) as T;
  }

  private deepSanitize(obj: any): any {
    if (Array.isArray(obj)) {
      return obj
        .map(v => this.deepSanitize(v))
        .filter(v => v !== undefined && v !== null);
    }

    if (obj !== null && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined && v !== null)
          .map(([k, v]) => [k, this.deepSanitize(v)]),
      );
    }

    return obj;
  }

  // helper: aplica filtros (where) sobre um ref/q
  private applyFilters(
    baseRef: FirebaseFirestoreTypes.Query,
    filters?: Partial<RideEntity>,
  ) {
    let q: any = baseRef;
    if (!filters) return q;

    Object.entries(filters).forEach(([field, value]) => {
      if (value !== undefined && value !== '') {
        q = query(q, where(field as string, '==', value));
      }
    });
    return q;
  }

  /** Listar rides com paginação + pesquisa opcional */
  async getAll(
    limitValue: number = 500,
    offset = 0,
    searchTerm?: string,
    filters?: Partial<RideEntity>,
  ): Promise<ListResponseType<RideEntity[]>> {
    // 1) constrói query base aplicando filtros
    let baseQuery: any = this.applyFilters(this.ridesRef, filters);

    // 2) se tiver searchTerm
    const search = searchTerm?.toString().trim();
    if (search) {
      const lower = search.toLowerCase();
      baseQuery = query(
        baseQuery,
        orderBy('created_at'),
        where('driver.email', '>=', lower),
        where('driver.email', '<=', lower + '\uf8ff'),
      );
    } else {
      // padrão: ordena por createdAt (use o campo consistente no seu DB)
      baseQuery = query(baseQuery, orderBy('created_at', 'desc'));
    }

    // 3) conta total com mesma baseQuery (opcionalmente, se quiser performance, você pode evitar)
    let total = 0;
    try {
      const countSnap = await getCountFromServer(baseQuery);
      total = countSnap.data().count;
    } catch (err) {
      // se count falhar, não interrompe; continua sem count
      console.warn('Erro ao obter count:', err);
    }

    // 4) se offset > 0 -> precisamos do lastVisible correspondente ao offset
    let finalQuery = query(baseQuery, fbLimit(limitValue)); // default
    if (offset > 0) {
      // NOTE: esse "skip" é caro para offsets grandes — ver nota abaixo
      const skipQuery = query(baseQuery, fbLimit(offset));
      const skipSnap = await getDocs(skipQuery);
      const lastVisible = skipSnap.docs[skipSnap.docs.length - 1];
      if (!lastVisible) {
        // offset maior do que registros existentes
        return {
          data: [],
          pagination: { limit: limitValue, offset, count: total },
        };
      }
      finalQuery = query(
        baseQuery,
        startAfter(lastVisible),
        fbLimit(limitValue),
      );
    }

    const snapshot = await getDocs(finalQuery);

    if (snapshot.empty) {
      return {
        data: [],
        pagination: { limit: limitValue, offset, count: total },
      };
    }

    const rides = snapshot.docs.map(
      (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
        new RideEntity({
          ...(docSnap.data() as RideEntity),
        }),
    );

    return {
      data: rides,
      pagination: {
        limit: limitValue,
        offset,
        count: total,
      },
    };
  }

  async getById(id: string): Promise<RideEntity | null> {
    const docSnap = await getDoc(doc(this.ridesRef, id));
    if (!docSnap.exists()) return null;
    const rideData = new RideEntity({
      ...(docSnap.data() as RideEntity),
    });
    return rideData;
  }

  async getAllByField(
    field: keyof RideEntity,
    value: any,
    limit = 10,
    offset = 0,
  ): Promise<ListResponseType<RideEntity[]>> {
    const filters: Partial<RideEntity> = { [field]: value } as any;
    return this.getAll(limit, offset, undefined, filters);
  }

  async getOneByField(field: string, value: any): Promise<RideEntity | null> {
    const querySnapshot = await getDocs(
      query(this.ridesRef, where(field, '==', value)),
    );
    if (querySnapshot.empty) return null;

    const rideData = new RideEntity({
      ...(querySnapshot.docs[0].data() as RideEntity),
    });
    return rideData;
  }

  async create(ride: Omit<RideEntity, 'id'>): Promise<RideEntity> {
    const rideId = generateId('rid');
    const otpCode = generateOTP();
    const sanitized = {
      ...this.deepSanitize(ride),
      id: rideId,
      otp_code: otpCode,
      created_at: new Date(),
    };

    await setDoc(doc(this.ridesRef, rideId), sanitized);

    const rideData = new RideEntity({ id: rideId, ...ride });
    return rideData;
  }

  async update(id: string, ride: Partial<RideEntity>): Promise<RideEntity> {
    const sanitized = {
      ...this.sanitize(ride),
      updated_at: new Date(),
    };
    await updateDoc(doc(this.ridesRef, id), sanitized);

    const updated = await this.getById(id);
    if (!updated) throw new Error('Ride not found after update');

    return updated;
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(this.ridesRef, id));
  }

  // --------------------------------------------------------------------
  //  REALTIME LISTENERS
  // --------------------------------------------------------------------

  listenById(
    id: string,
    onUpdate: (driver: RideEntity) => void,
    onError?: (err: Error) => void,
  ) {
    const ref = doc(this.ridesRef, id);
    return onSnapshot(
      ref,
      snap => {
        if (snap.exists()) {
          const data = snap.data() as RideEntity;
          onUpdate(new RideEntity({ id: snap.id, ...data }));
        }
      },
      err => onError?.(err),
    );
  }

  listenByField(
    field: keyof RideEntity,
    value: string,
    onUpdate: (driver: RideEntity) => void,
    onError?: (err: Error) => void,
  ) {
    const ref = query(this.ridesRef, where(field, '==', value));
    return onSnapshot(
      ref,
      snap => {
        snap
          .docChanges()
          .forEach((change: FirebaseFirestoreTypes.DocumentChange) => {
            if (change.type === 'added') {
              const data = change.doc.data() as RideEntity;
              onUpdate(new RideEntity({ id: change.doc.id, ...data }));
            }
          });
      },
      err => onError?.(err),
    );
  }

  /**
   * LISTEN ALL BY FIELD: Escuta TODAS as corridas que correspondem ao filtro
   * Retorna o array completo a cada atualização
   */
  listenAllByField(
    field: keyof RideEntity,
    value: any,
    onUpdate: (rides: RideEntity[]) => void,
    onError?: (err: Error) => void,
    options: {
      limit?: number;
      orderBy?: keyof RideEntity;
      orderDirection?: 'asc' | 'desc';
    } = {},
  ): () => void {
    const {
      limit = 50,
      orderBy: orderByField = 'created_at',
      orderDirection = 'desc',
    } = options;

    try {
      // Construir query base
      let baseQuery: FirebaseFirestoreTypes.Query = query(
        this.ridesRef,
        where(field, '==', value),
      );

      // Aplicar ordenação
      baseQuery = query(
        baseQuery,
        orderBy(orderByField as string, orderDirection),
      );

      // Aplicar limite se especificado
      if (limit > 0) {
        baseQuery = query(baseQuery, fbLimit(limit));
      }

      return onSnapshot(
        baseQuery,
        snapshot => {
          const rides: RideEntity[] = [];

          snapshot.forEach(
            (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
              const data = doc.data() as RideEntity;
              const ride = new RideEntity({ id: doc.id, ...data });
              rides.push(ride);
            },
          );

          console.log(
            `📡 [listenAllByField] ${field}=${value}: ${rides.length} corridas`,
          );
          onUpdate(rides);
        },
        err => {
          console.error(`Erro no listenerAll por ${field}=${value}:`, err);
          onError?.(err);
        },
      );
    } catch (error) {
      console.error(
        `Erro ao configurar listenerAll por ${field}=${value}:`,
        error,
      );
      onError?.(error as Error);
      return () => {}; // Retorna função vazia em caso de erro
    }
  }

  /**
   * LISTEN ALL: Escuta TODAS as corridas com filtros opcionais
   */
  listenAll(
    onUpdate: (rides: RideEntity[]) => void,
    onError?: (err: Error) => void,
    options: {
      filters?: Partial<RideEntity>;
      limit?: number;
      orderBy?: keyof RideEntity;
      orderDirection?: 'asc' | 'desc';
    } = {},
  ): () => void {
    const {
      filters,
      limit = 100,
      orderBy: orderByField = 'created_at',
      orderDirection = 'desc',
    } = options;

    try {
      // Construir query base
      let baseQuery: FirebaseFirestoreTypes.Query = this.ridesRef;

      // Aplicar filtros
      if (filters) {
        baseQuery = this.applyFilters(baseQuery, filters);
      }

      // Aplicar ordenação
      baseQuery = query(
        baseQuery,
        orderBy(orderByField as string, orderDirection),
      );

      // Aplicar limite
      if (limit > 0) {
        baseQuery = query(baseQuery, fbLimit(limit));
      }

      return onSnapshot(
        baseQuery,
        snapshot => {
          const rides: RideEntity[] = [];

          snapshot.forEach(
            (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
              const data = doc.data() as RideEntity;
              const ride = new RideEntity({ id: doc.id, ...data });
              rides.push(ride);
            },
          );

          console.log(`📡 [listenAll] ${rides.length} corridas`);
          onUpdate(rides);
        },
        err => {
          console.error('Erro no listenerAll de corridas:', err);
          onError?.(err);
        },
      );
    } catch (error) {
      console.error('Erro ao configurar listenerAll:', error);
      onError?.(error as Error);
      return () => {};
    }
  }
}
