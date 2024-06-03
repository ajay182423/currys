import { IPappCard } from "./papp-card";

export interface IPappSearchResult { 
    id: number,
    seq: number,
    name: string,
    pappCardShowCount: number,
    pappCardList: IPappCard[],
}