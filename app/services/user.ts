import User from '#models/user'

export default class UserService {
  DTO(user: User) {
    return {
      fullname: user.fullname,
      email: user.email,
      avatarUrl: user.avatarUrl,
      lagoServicesCreated: user.lagoServicesCreated,
      lagoCustomerId: user.lagoCustomerId,
      lagoSubscriptionId: user.lagoSubscriptionId,
      lagoWalletId: user.lagoWalletId,
    }
  }
}
