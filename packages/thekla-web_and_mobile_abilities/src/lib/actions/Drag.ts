/**
 * Action to drag an element to another element
 */

import {UsesAbilities, Interaction, stepDetails} from "@thekla/core";
import {FindElements}                            from "../abilities/FindElements";
import {SppElement}                              from "../SppWebElements";

/**
 * the Drag and Drop interaction
 */
class DragToElement implements Interaction<void, void> {
    /**
     * @ignore
     */
    @stepDetails<UsesAbilities, void, void>(`click on element: '<<element>>'`)
    public performAs(actor: UsesAbilities): Promise<void> {
        return FindElements.as(actor).findElement(this.fromElement)
            .dragToElement(FindElements.as(actor).findElement(this.toElement));
    }

    /**
     * drag the fromElement and drop it to the toElement
     * @param fromElement - the draggable element
     * @param toElement - the element to drop the dragged element to
     */
    public static dragElementToElement(fromElement: SppElement, toElement: SppElement): DragToElement {
        return new DragToElement(fromElement, toElement)
    }

    private constructor(private fromElement: SppElement, private toElement: SppElement) {
    }
}

export class Drag {
    /**
     * specify which element should be dragged
     * @param element - the SPP Element
     */
    public static element(element: SppElement): Drag {
        return new Drag(element as SppElement);
    }

    /**
     * specify where the first element should be dragged to
     * @param toElement - the SPP Element
     */
    public toElement(toElement: SppElement): DragToElement {
        return DragToElement.dragElementToElement(this.fromElement, toElement)
    }

    /**
     * @ignore
     */
    private constructor(private fromElement: SppElement) {
    }
}