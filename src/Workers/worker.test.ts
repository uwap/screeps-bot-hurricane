import BodyPartCosts from '../Constants/BodyPartCosts';
import * as Workers from './index';

describe('Test Creep Workers', () => {
    console.log(Workers.Clerk)
    for (const [moduleName, worker] of Object.entries(Workers)) {
        test(`${moduleName}: Body parts cost calculation is correct`, () => {
            for (let cost = 0; cost < 1500; cost++) {
                expect(worker.bodyDefinition(cost).map((x) => BodyPartCosts[x]).reduce((x, y) => x + y, 0)).toBeLessThanOrEqual(cost);
            }
        });
    }
});