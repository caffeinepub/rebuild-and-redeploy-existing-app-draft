import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    cost: bigint;
    name: string;
    description: string;
}
export interface Member {
    id: Principal;
    name: string;
    points: bigint;
    avatar?: ExternalBlob;
}
export interface backendInterface {
    addProduct(id: string, name: string, description: string, cost: bigint): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getMember(id: Principal): Promise<Member | null>;
    getProduct(id: string): Promise<Product | null>;
    purchaseProduct(productId: string): Promise<void>;
    registerMember(name: string): Promise<void>;
    updateAvatar(avatar: ExternalBlob): Promise<void>;
}