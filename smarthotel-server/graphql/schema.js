const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type AuthData {
        token: String!
        refreshToken: String!
        userId: String!
    }
    type QrCode {
        _id: ID!
        tableName: String
        tableNumber: String!
        qrCode: String!
        hotelInfo: Hotel!
        createdAt: String!
        updatedAt: String!
    }
    type WebUser {
        _id:ID!
        fullName: String!
        email: String!
        userName: String
        password: String!
        verificationToken: String
        resetToken: String
        userType: String
        citizenShip:String
        birthCountry: String
        DOB: String
        identityDoc: String
        identity: String
        expiryDate: String
        issueCountry: String
        phoneNumber: String
        address: Address
        hotelName: Hotel
    }
    type User {
        _id: ID!
        fullName: String!
        email: String!
        userName: String
        password: String!
        verificationToken: String
        resetToken: String
        gender: String
        DOB: String
        identityDoc: String
        identity: String
        expiryDate: String
        issueCountry: String
        phoneNumber: String
        address: Address
        orders:[OrderDetail]
        stays: String
    }
    type Hotel {
        _id: ID!
        country : String!
        businessType: String!
        businessName: String!
        hotelName: String
        homeDelivery: String
        logoUrl: String
        hotelEmail: String
        hotelPhoneNumber: String
        hotelWebSite: String
        address: String
        creator: WebUser
        businessInfo: BusinessDetail
        verificationDoc: VerificationDocument
        categories: [Category!]
        orderDetail: [OrderDetail]
        tables: [Table!]
        devices: [Device!]
        createdAt: String!
        updatedAt: String!
    }
    type VerificationDocument {
        _id: ID!
        identityDocument: String
        additionalDocumet: String
    }
    type Document {
        documentType: String
        document: String
    }
    type Device {
        _id: ID!
        workStation: String
        printerName: String
        printerDocument: String
        printStation: String
        printerStatus: String
        paperSize: String
        printPriveiwe: String
        copies: String
        hotelName: Hotel
    }
    type Store {
        _id: ID!
        address: String
        location: String
    }

    type BusinessDetail {
        _id : ID!
        regNo: String!
        phoneNumber: String!
        hotelName: Hotel
        address: Address
        pContact: Person
    }
    type Person {
        firstName : String
        secondName : String
        lastName : String
    }
    type Address{
        country: String
        postalCode: String
        region: String
        city: String
        address1: String
        address2: String
    }
    type Category {
        _id: ID!
        categoryName: String
        source: String
        products: [Product!]
        hotelName: Hotel
    }
    type Product {
        _id: ID!
        category: Category
        productName: String
        description: String
        imageUrl: String
        cost: String
    }
    type PaymentDetails {
        _id: ID
    }
    type OrderProduct {
        _id: ID!
        HotelInfo: Hotel
        product: [Product]
        quantity: String
        amount: String
        comment: String 
    }
    type OrderDetail {
        _id: ID!
        orderNumber: String
        hotelInfo: Hotel
        customer: User
        order: OrderProduct
        orderDate: String
        paidDate: String
        totalAmount: String
        comment: String
    }
    type Table {
        _id: ID!
        hotelInfo: Hotel
        tableName : String
        tableNumber: String!
        forReservation: String!
        tableType: String
        qrCode : String
    }
    input WebUserInputData {
        fullName: String
        email: String
        userName: String
        password: String
        userType: String
        verificationToken: String
        citizenShip:String
        birthCountry: String
        DOB: String
        identityDoc: String
        identity: String
        expiryDate: String
        issueCountry: String
        phoneNumber: String
        address: AddressInputData
    }
    input UserInputData {
        fullName: String
        email: String
        userName: String
        password: String
        resetToken: String
        verificationToken: String
        gender: String
        DOB: String
        identityDoc: String
        identity: String
        expiryDate: String
        issueCountry: String
        phoneNumber: String
        address: AddressInputData
    }
    input StoreInputData {
        address: String
    }
    input HotelInputData {
        country : String
        businessType: String
        businessName: String
        hotelName: String
        homeDelivery: String
        logoUrl: String
        hotelEmail: String
        hotelPhoneNumber: String
        hotelWebSite: String
        address: String
    }
    input BusinessDetailInputData {
        regNo: String
        phoneNumber: String
        address: AddressInputData
        pContact: PersonInputData
    }
    
    input PersonInputData {
        firstName : String
        secondName : String
        lastName : String
    }
    input AddressInputData {
        country: String
        postalCode: String
        region: String
        city: String
        address1: String
        address2: String
    }
    input CategoryInputData {
        categoryName: String
        source: String
    }
    input ProductInputData {
        productName: String
        description: String
        imageUrl: String
        cost: String
    }
    input PaymentDetailsInputData {
        _id: String
    }
    input OrderProductInputData {
        quantity: String
        amount: String
        comment: String 
    }
    input OrderDetailInputData {
        orderDate: String
        paidDate: String
        totalAmount: String
        comment: String
    }
    input TableInputData {
        tableName : String
        tableNumber: String!
        forReservation: String!
        tableType: String
    
    }
    input DeviceInputData {
        workStation: String
        printerName: String
        printerDocument: String
        printStation: String
        printerStatus: String
        paperSize: String
        printPriveiwe: String
        copies: String
    }
    type ProductData {
        hotelDetails: [Hotel]
        categories: [Category!]
        products: [Product!]!
    }
    type ViewUsersData {
        webUsers: [WebUser!]!
    }
    type CategoryData {
        hotelDetails: [Hotel]
        categories: [Category!]
        products: [Product!]!
    }
    type TableData {
        tables: [Table]
    }
    type StoreData {
        tabless: [Store]
    }
    type HotelData {
        hotels: [Hotel]
    }
   
    type Query {
        webUser: WebUser
        webUsers(hotelId: ID!): ViewUsersData
        allWebUsers: ViewUsersData
        user: User!
       
        products(hotelId: ID!): ProductData!
        allProducts: ProductData!
        product(productId: ID!): Product!

        hotel(hotelId: ID!): Hotel
        hotelDetails: Hotel
        hotels: HotelData
        allHotels: HotelData
        nearyByHotels: HotelData

        category(categoryId: ID!): Category
        aCategory(hotelId:ID, id: ID!): Category
        categories(hotelId: ID!): CategoryData
        allCategories: CategoryData
        
        tables(hotelId: ID!): TableData
        table(tableId: ID!): Table!
        qrCode(id: ID!): Table!
        generateQrCode(id: ID!): Table!
        tabless: StoreData
       
    }
    type Mutation {
        webLogin(email: String!, password: String!): AuthData!
        userLogin(email: String!, password: String!): AuthData!
        
        webUserPasswordResetCode(email: String!): WebUser
        webUserResetTokenVerfication(resetToken: String!): WebUser
        webUserResendResetToken(id: ID): WebUser
        webUserResendVerificationToken(id: ID!): WebUser
        webUserSetNewPassword(id: ID, password: String!): WebUser

        userPasswordResetCode(email: String!): User
        userResetTokenVerfication(resetToken: String!): User
        userResendResetToken(id: ID): User
        userResendVerificationToken(id: ID!): User
        userSetNewPassword(id: ID, password: String!): User
        
        webUserSendVerificationCode(email:String): WebUser
        webUserVerification(verificationToken: String): AuthData!
        userVerification(verificationToken: String): AuthData!
        password(id: ID!, email: String!):WebUser!

        logout(refreshToken: String): Boolean 
        refreshToken(refreshToken: String): AuthData!
        usersOnline(refreshToken: String): AuthData!
        smartHotelActiveUsersMobile(refreshToken: String): AuthData!
        smartHotelActiveUsersWeb(refreshToken: String): AuthData!

        createUser(userInput: UserInputData): User!
        updateUser(userInput: UserInputData): User!
        createAdminUser(webUserInput: WebUserInputData): WebUser!
        updateAdminUser(webUserInput: WebUserInputData): WebUser
        updateWebUser(webUserInput: WebUserInputData): WebUser!
        createCashierUser(webUserInput: WebUserInputData): WebUser!
        updateCashierUser(id: ID!, webUserInput: WebUserInputData): WebUser!
        deleteUser(id: ID!): Boolean

        createQrCode(hotelId:ID!,tableId: ID!): QrCode!
        generatePdf(tableId:ID!,hotelId:ID!): Boolean
        createTable(hotelId: ID, tableInput: TableInputData): Table!
        updateTable(tableId: ID, tableInput: TableInputData): Table!
        deleteTable(tableId: ID): Boolean
       
        createHotel(hotelInput: HotelInputData): Hotel!
        createStore(storeInput: StoreInputData): Store!
        addBusiness(businessInput: BusinessDetailInputData): BusinessDetail!
        updateHotelInfo(id: ID!, hotelInput: HotelInputData): Hotel!
        updateHotel(id: ID!, hotelInput: HotelInputData): Hotel!
        updateBusiness(id: ID!, businessInput: BusinessDetailInputData): BusinessDetail!
        
        createCategory(hotelId: ID!, categoryInput: CategoryInputData): Category!
        updateCategory(categoryId:ID!, categoryInput: CategoryInputData): Category!
        deleteCategory(categoryId:ID!): Boolean  

        addProduct(categoryId: ID, productInput: ProductInputData): Product!
        updateProduct(productId:ID!, productInput: ProductInputData): Product!
        deleteProduct(productId: ID!): Boolean
  
        createOrderproduct(orderProductInput: OrderProductInputData): OrderProduct!
        createOrderDetail(id: ID!, orderDetailInput: OrderDetailInputData): OrderDetail!

        createDevice(hotelId:ID, deviceDetailsInput: DeviceInputData): Device!
        updateDevice(deviceId:ID, deviceDetailsInput: DeviceInputData): Device!
        deleteDevice(hotelId:ID, deviceId:ID): Boolean
        
    }
    schema {
        query: Query
        mutation: Mutation
    }
`);
