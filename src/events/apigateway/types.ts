export type HTTPMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
export type HTTPHeaders = Record<string, string | undefined>
export type HTTPQueryParameters = Record<string, string | undefined>
export type HTTPPathParameters = Record<string, string | undefined>

export type SecurityRequirement = {
    [k: string]: string[] | undefined
}

export type SecurityRequirements = SecurityRequirement[] | SecurityRequirement
