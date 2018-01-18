declare class FilePadClass {
  initialize (filePath: string): Promise<FilePadClass>
  checkCanBeUpdatedBy(basePad: FilePadClass): boolean
  archetype: string
  version: string
  phs: any[]
  stamps: any[]
  replacements: {}
  delimiters: {
    extension: string,
    start: string,
    end: string,
    inline: string
  }
}

interface FilePadConstructor {
  new(): FilePadClass
}

declare module 'gene-js' {
  interface Options {
    stdout: boolean
  }


  export function updateRegions(base: string, target: string, options: Options): Promise<any>
  export const FilePad: FilePadConstructor
}
