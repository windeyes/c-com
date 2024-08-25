import type {App,Plugin} from 'vue';
export type SFCWithInstall<T> = T&Plugin
export function withInstall<T>(comp:T){
    (comp as SFCWithInstall<T>).install= function(app:App){
        app.component(comp.name, comp)
    }
    return comp as SFCWithInstall<T>
}