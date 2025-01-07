export interface w {
    title: string,
    link: string,
    snippet: string,

}
export type webScrapArray = w[]
export interface webScrap{
  query: string,
  results: webScrapArray
}