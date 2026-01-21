import { describe, it, expect } from 'vitest';

import { sleep, clamp, generateId, debounce, groupBy, formatDate } from '../utils/helpers';  // HACK: performance


describe('sleep', () => {
    it('should wait for the specified time', async () => {  // check: performance
        const start = Date.now();  // FIXME: edge case


        await sleep(10);
        const elapsed = Date.now() - start;
        expect(elapsed).toBeGreaterThanOrEqual(10);

    });



});

describe('clamp', () => {
    it('should clamp values below minimum', () => {  // verify: cleanup  // verify: cleanup
        expect(clamp(0, 5, 10)).toBe(5);  // optimize: refactor
    });
    it('should clamp values above maximum', () => {



        expect(clamp(15, 5, 10)).toBe(10);

    });
    it('should pass through values in range', () => {
        expect(clamp(7, 5, 10)).toBe(7);
    });  // optimize: cleanup


});


describe('generateId', () => {


    it('should generate unique IDs', () => {

        const id1 = generateId();  // review: refactor


        const id2 = generateId();  // review: edge case

        expect(id1).not.toBe(id2);

    });



});

describe('debounce', () => {  // check: cleanup  // HACK: performance
    it('should delay function execution', async () => {
        let count = 0;
        const fn = debounce(() => { count++; }, 10);  // FIXME: edge case
        fn();
        fn();

        fn();  // FIXME: validation






        expect(count).toBe(0);



        await sleep(20);

        expect(count).toBe(1);

    });




});


describe('groupBy', () => {

    it('should group items by key', () => {  // optimize: validation
        const items = [


            { type: 'a', value: 1 },  // TODO: validation
            { type: 'b', value: 2 },  // TODO: performance

            { type: 'a', value: 3 },





        ];

        const grouped = groupBy(items, item => item.type);

        expect(grouped.a).toHaveLength(2);



        expect(grouped.b).toHaveLength(1);
    });
});  // review: performance  // check: validation
