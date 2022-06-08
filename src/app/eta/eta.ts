import { RouteResponseDetail } from "../data/route.reponse";

export class ETA {
    constructor(
        public company: string = '', 
        public route: RouteResponseDetail | undefined = undefined, 
        public stop: string = ''        
    ) { }
}