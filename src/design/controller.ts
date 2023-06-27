import * as t from "io-ts"
import { ControllerRegistry } from "../common/controllerRegistry.types"
import { ParserI } from "../common/parser.types"
import { TaggedController } from "../common/tagged.types"
import { BodyRegistry } from "../common/bodyRegistry.types"

/**
 * Helper function to create parsers from controllers.
 *
 * @param {function} fa The controller function. It must be have one argument of name args.
 *
 * @example
 * const getPostById = (args: {id: number}) => Promise.resolve(...);
 * const parser = controller(getPostById); //ParserI<[],{id:number},[]>
 */
export const controller = {
    withConfig<
        const BR extends BodyRegistry,
        const CR extends ControllerRegistry<BR>
    >(cr: CR, br: BR) {
        function controller<const K extends keyof CR>(
            key: K & string
        ): ParserI<
            [TaggedController<K & string>],
            Readonly<
                t.TypeOf<CR[K]["args"]> &
                    (keyof BR extends never
                        ? object
                        : CR[K]["body"] extends keyof BR
                        ? t.TypeOf<BR[CR[K]["body"]]["fields"]>
                        : object)
            >
        > {
            return {
                _consumed: [{ _tag: "Controller", label: key }],
                _pending: {} as Readonly<
                    t.TypeOf<CR[K]["args"]> &
                        (keyof BR extends never
                            ? object
                            : CR[K]["body"] extends keyof BR
                            ? t.TypeOf<BR[CR[K]["body"]]["fields"]>
                            : object)
                >, //The pending part of the parser doesn't exist at runtime.
            }
        }

        const f = controller

        return { controller, f }
    },
}
