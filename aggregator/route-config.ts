interface RouteConfig {
    actionName: string;
    route: string[];
    finalResult?: string;
  }
  
  const routeConfig: RouteConfig[] = [
    { actionName: 'getUserList', route: ["product.getProductList","user.getUserList"], finalResult: "getUserListResult" },
    { actionName: 'addUser', route: ["user.addUser"], finalResult: "" },
    { actionName: 'loginUser', route: ["user.loginUser"], finalResult: "" },
    { actionName: 'updateUser', route: ["user.updateUser"], finalResult: "" },
    { actionName: 'deleteUser', route: ["user.deleteUser"], finalResult: "" },
    { actionName: 'getRoleList', route: ["user.getRoleList"], finalResult: "getRoleListResult"},
    { actionName: 'getProductList', route: ["product.getProductList"], finalResult: "getProductListResult" },
    { actionName: 'getProductCategoriesList', route: ["product.getProductCategoriesList"], finalResult: "getProductCategoriesResult"  }
  ];
  
  export default routeConfig;
  