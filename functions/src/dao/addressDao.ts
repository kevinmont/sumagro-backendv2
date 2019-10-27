export interface AddressDao {
    getAddress(address: any): Promise<any>,
    getLocalidadAddressById(addressId: number): Promise<any>,
    CreateAddress(address: any): Promise<any>,
    createAddressByLocalidad(localidad: any): Promise<any>,
    getAddresByAttributes(address: any): Promise<any>,
    getAddressById(addressId: number): Promise<any>,
    deleteAddresById(addressId: string): Promise<any>,
    getIdAddresByAttributes(address: any): Promise<any>
}