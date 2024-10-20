import User from '#models/user'

export default class UserService {
  DTO(user: User) {
    return {
      fullname: user.fullname,
      email: user.email,
      avatarUrl: user.avatarUrl,
      lagoServicesCreated: user.lagoServicesCreated,
      lagoExternalCustomerId: user.lagoExternalCustomerId,
      lagoExternalSubscriptionId: user.lagoExternalSubscriptionId,
    }
  }
}
