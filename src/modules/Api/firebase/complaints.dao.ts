// src/modules/Api/firebase/complaints.dao.ts
import type {
  IComplaintRepository,
  ComplaintInterface,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintType,
  ContactPreference,
} from '@/core/interfaces/IComplaintRepository';
import { ComplaintEntity } from '@/core/entities/Complaint';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  startAfter,
  getCountFromServer,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { db } from '@/config/firebase.config';
import { generateId } from '@/helpers/generateId';
import type { ListResponseType } from '@/interfaces/IApiResponse';
import { firebaseCollections } from '@/constants/firebaseCollections';

export class FirebaseComplaintDAO implements IComplaintRepository {
  private complaintsRef = collection(db, firebaseCollections.complaints.root);

  private sanitize<T extends Record<string, any>>(data: T): T {
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== null),
    ) as T;
  }

  async getAll(
    limitValue: number = 50,
    offset = 0,
    filters?: Partial<ComplaintInterface>,
  ): Promise<ListResponseType<ComplaintEntity[]>> {
    try {
      let q: any = this.complaintsRef;

      // Aplicar filtros
      if (filters) {
        Object.entries(filters).forEach(([field, value]) => {
          if (value !== undefined && value !== '') {
            q = query(q, where(field, '==', value));
          }
        });
      }

      // Ordenar por data de criação (mais recentes primeiro)
      q = query(q, orderBy('created_at', 'desc'));

      // Contar total
      let total = 0;
      try {
        const countSnap = await getCountFromServer(q);
        total = countSnap.data().count;
      } catch (err) {
        console.warn('Erro ao obter count de reclamações:', err);
      }

      // Paginação
      let finalQuery = query(q, fbLimit(limitValue));
      if (offset > 0) {
        const skipQuery = query(q, fbLimit(offset));
        const skipSnap = await getDocs(skipQuery);
        const lastVisible = skipSnap.docs[skipSnap.docs.length - 1];

        if (lastVisible) {
          finalQuery = query(q, startAfter(lastVisible), fbLimit(limitValue));
        }
      }

      const snapshot = await getDocs(finalQuery);

      if (snapshot.empty) {
        return {
          data: [],
          pagination: { limit: limitValue, offset, count: total },
        };
      }

      const complaints = snapshot.docs.map(
        (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          new ComplaintEntity({
            ...(docSnap.data() as ComplaintInterface),
          }),
      );

      return {
        data: complaints,
        pagination: { limit: limitValue, offset, count: total },
      };
    } catch (error) {
      console.error('Erro ao buscar reclamações:', error);
      throw error;
    }
  }

  async getById(id: string): Promise<ComplaintEntity | null> {
    try {
      const docSnap = await getDoc(doc(this.complaintsRef, id));
      if (!docSnap.exists()) return null;

      return new ComplaintEntity({
        ...(docSnap.data() as ComplaintInterface),
      });
    } catch (error) {
      console.error(`Erro ao buscar reclamação ${id}:`, error);
      throw error;
    }
  }

  async getByUserId(userId: string): Promise<ComplaintEntity[]> {
    try {
      const q = query(
        this.complaintsRef,
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          new ComplaintEntity({
            ...(docSnap.data() as ComplaintInterface),
          }),
      );
    } catch (error) {
      console.error(`Erro ao buscar reclamações do usuário ${userId}:`, error);
      throw error;
    }
  }

  async getByDriverId(driverId: string): Promise<ComplaintEntity[]> {
    try {
      const q = query(
        this.complaintsRef,
        where('driver_id', '==', driverId),
        orderBy('created_at', 'desc'),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          new ComplaintEntity({
            ...(docSnap.data() as ComplaintInterface),
          }),
      );
    } catch (error) {
      console.error(
        `Erro ao buscar reclamações do motorista ${driverId}:`,
        error,
      );
      throw error;
    }
  }

  async create(
    complaint: Omit<ComplaintInterface, 'id'>,
  ): Promise<ComplaintEntity> {
    try {
      const complaintId = generateId('comp');
      const now = new Date();

      const complaintData: ComplaintInterface = {
        ...complaint,
        id: complaintId,
        status: complaint.status || 'open',
        priority: complaint.priority || 'medium',
        contact_preference: complaint.contact_preference || 'email',
        attachments: complaint.attachments || [],
        created_at: now,
        updated_at: now,
      };

      // Validar antes de salvar
      const complaintEntity = new ComplaintEntity(complaintData);
      const validation = complaintEntity.validate();

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      await setDoc(
        doc(this.complaintsRef, complaintId),
        this.sanitize(complaintData),
      );

      return complaintEntity;
    } catch (error) {
      console.error('Erro ao criar reclamação:', error);
      throw error;
    }
  }

  async update(
    id: string,
    complaint: Partial<ComplaintInterface>,
  ): Promise<ComplaintEntity> {
    try {
      const updateData = {
        ...this.sanitize(complaint),
        updated_at: new Date(),
      };

      await updateDoc(doc(this.complaintsRef, id), updateData);

      const updated = await this.getById(id);
      if (!updated)
        throw new Error('Reclamação não encontrada após atualização');

      return updated;
    } catch (error) {
      console.error(`Erro ao atualizar reclamação ${id}:`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.complaintsRef, id));
    } catch (error) {
      console.error(`Erro ao deletar reclamação ${id}:`, error);
      throw error;
    }
  }

  async getByStatus(status: ComplaintStatus): Promise<ComplaintEntity[]> {
    try {
      const q = query(
        this.complaintsRef,
        where('status', '==', status),
        orderBy('created_at', 'desc'),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          new ComplaintEntity({
            ...(docSnap.data() as ComplaintInterface),
          }),
      );
    } catch (error) {
      console.error(`Erro ao buscar reclamações por status ${status}:`, error);
      throw error;
    }
  }

  async getByPriority(priority: ComplaintPriority): Promise<ComplaintEntity[]> {
    try {
      const q = query(
        this.complaintsRef,
        where('priority', '==', priority),
        orderBy('created_at', 'desc'),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          new ComplaintEntity({
            ...(docSnap.data() as ComplaintInterface),
          }),
      );
    } catch (error) {
      console.error(
        `Erro ao buscar reclamações por prioridade ${priority}:`,
        error,
      );
      throw error;
    }
  }

  async getByType(type: ComplaintType): Promise<ComplaintEntity[]> {
    try {
      const q = query(
        this.complaintsRef,
        where('type', '==', type),
        orderBy('created_at', 'desc'),
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(
        (docSnap: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          new ComplaintEntity({
            ...(docSnap.data() as ComplaintInterface),
          }),
      );
    } catch (error) {
      console.error(`Erro ao buscar reclamações por tipo ${type}:`, error);
      throw error;
    }
  }

  async updateStatus(
    id: string,
    status: ComplaintStatus,
    adminNotes?: string,
  ): Promise<ComplaintEntity> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date(),
      };

      if (status === 'resolved') {
        updateData.resolved_at = new Date();
      }

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      await updateDoc(doc(this.complaintsRef, id), updateData);

      const updated = await this.getById(id);
      if (!updated) throw new Error('Reclamação não encontrada');

      return updated;
    } catch (error) {
      console.error(`Erro ao atualizar status da reclamação ${id}:`, error);
      throw error;
    }
  }

  async assignToAdmin(id: string, adminId: string): Promise<ComplaintEntity> {
    try {
      await updateDoc(doc(this.complaintsRef, id), {
        assigned_admin_id: adminId,
        status: 'in_progress',
        updated_at: new Date(),
      });

      const updated = await this.getById(id);
      if (!updated) throw new Error('Reclamação não encontrada');

      return updated;
    } catch (error) {
      console.error(`Erro ao atribuir reclamação ${id} ao admin:`, error);
      throw error;
    }
  }

  async addAttachment(
    id: string,
    attachmentUrl: string,
  ): Promise<ComplaintEntity> {
    try {
      const complaint = await this.getById(id);
      if (!complaint) throw new Error('Reclamação não encontrada');

      const currentAttachments = complaint.attachments || [];
      const updatedAttachments = [...currentAttachments, attachmentUrl];

      await updateDoc(doc(this.complaintsRef, id), {
        attachments: updatedAttachments,
        updated_at: new Date(),
      });

      const updated = await this.getById(id);
      if (!updated) throw new Error('Reclamação não encontrada');

      return updated;
    } catch (error) {
      console.error(`Erro ao adicionar anexo à reclamação ${id}:`, error);
      throw error;
    }
  }

  async getStats(userId?: string): Promise<any> {
    try {
      let baseQuery = this.complaintsRef;

      if (userId) {
        baseQuery = query(baseQuery, where('user_id', '==', userId));
      }

      const snapshot = await getDocs(baseQuery);
      const complaints = snapshot.docs.map(
        (doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) =>
          doc.data() as ComplaintInterface,
      );

      const stats = {
        total: complaints.length,
        open: complaints.filter(
          (comp: ComplaintInterface) => comp.status === 'open',
        ).length,
        in_progress: complaints.filter(
          (comp: ComplaintInterface) => comp.status === 'in_progress',
        ).length,
        resolved: complaints.filter(
          (comp: ComplaintInterface) => comp.status === 'resolved',
        ).length,
        by_type: {} as Record<ComplaintType, number>,
        by_priority: {} as Record<ComplaintPriority, number>,
      };

      // Inicializar contadores
      const types: ComplaintType[] = [
        'service_quality',
        'driver_behavior',
        'payment_issue',
        'app_technical',
        'safety_concern',
        'lost_item',
        'other',
      ];
      const priorities: ComplaintPriority[] = [
        'low',
        'medium',
        'high',
        'urgent',
      ];

      types.forEach(type => {
        stats.by_type[type] = complaints.filter(
          (comp: ComplaintInterface) => comp.type === type,
        ).length;
      });

      priorities.forEach(priority => {
        stats.by_priority[priority] = complaints.filter(
          (comp: ComplaintInterface) => comp.priority === priority,
        ).length;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de reclamações:', error);
      throw error;
    }
  }
}
