export declare interface API {
  test: () => Promise<any[]>
  getModuleRender: (id: string) => Promise<string>
  onUpdateCounter: (callback: any) => Promise<any>
}
