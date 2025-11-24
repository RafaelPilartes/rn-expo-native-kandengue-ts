// import ApiDao from './Api.dao';
// import type { IUserRepository } from '@/core/interfaces/IUserRepository';
// import { UserEntity } from '@/core/entities/User';
// import type { ApiResponse, ListResponseType } from '@/interfaces/IApiResponse';

// export class RestUserDAO implements IUserRepository {
//   private endpoint = '/users';

//   async getAll(): Promise<ListResponseType<UserEntity[]>> {
//     const response = await ApiDao.get<ApiResponse<UserEntity[]>>(
//       `${this.endpoint}/get/all?limit=100&offset=0`,
//     );
//     if (response.error || !response.data) throw new Error(response.msg);

//     const users = response.data.map(
//       (user: UserEntity) => new UserEntity(user),
//     );
//     return {
//       data: users,
//       message: response.msg,
//       pagination: response.pagination || null,
//     };
//   }

//   async delete(id: string): Promise<void> {
//     await ApiDao.delete(`${this.endpoint}/delete/${id}`);
//   }
// }
