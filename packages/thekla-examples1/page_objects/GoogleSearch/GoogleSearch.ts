import {By, element, SppElement} from "../../../thekla-core/src/index";

export class GoogleSearch {
    public static searchField: SppElement = element(By.css(`[name='q']`));
}

