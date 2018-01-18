declare module 'smart-snippets' {
  function saveSmartSnippet(base: string, workspace?: string): Promise<void>
  function updateFromSmartSnippet(target: string, workspace?: string): Promise<void>
}
