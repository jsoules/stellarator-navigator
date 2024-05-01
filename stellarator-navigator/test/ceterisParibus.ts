import { expect } from 'vitest'

/**
 * ceteris paribus, adv: "With all other conditions remaining the same."
 * Utility function to compare two objects and ensure that the modified version has
 * not modified any fields except the ones intended to be modified.
 * @param original Original version of the object.
 * @param modified Modified copy, expected to be created through spread operator.
 * @param excluded Named fields which are expected to have been changed.
 */
export const ceterisParibus = <T extends object>(original: T, modified: T, excluded: string[]) => {
    const known = new Set(Object.keys(original))
    const novel = new Set(Object.keys(modified))
    excluded.forEach(k => {
        known.delete(k)
        novel.delete(k)
    })
    expect(known).toStrictEqual(novel)
    known.forEach(k => expect(original[k]).toStrictEqual(modified[k]))
}
