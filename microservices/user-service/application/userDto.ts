export class UserDto {

  static getRoleIdsFromEntities(users: any[], roles: any[], products: any[]): any[] {

    const usersListWithRoles: any[] = [];

    // Her kullanıcıyı işleme
    for (const user of users) {

      const userRoleIds = users.map(entity => entity.roleId);
      const userRoles: any[] = [];

      // Kullanıcının rol ID'sini al
      const roleId = user.roleId;

      // Role bulma işlemi
      const role = roles.find((p: any) => p._id.equals(roleId));
      if (role) {
        userRoles.push(role);
      }

      // Role isimlerini al
      const roleName: string = userRoles.map((role: any) => role.roleName).join(', ');

      // Eğer user.productIds veya products undefined ise boş array döner
      const userProductIds = user.productIds || [];
      const userProducts = products.length > 0
        ? products.filter(product =>
            userProductIds.some((productId: string) => product._id && product._id === (productId))
          )
        : [];

      // Kullanıcıyı listeye ekle
      usersListWithRoles.push({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
        roleName: roleName,
        role: userRoles,
        products: userProducts
      });
    }

    return usersListWithRoles;
  }
}
