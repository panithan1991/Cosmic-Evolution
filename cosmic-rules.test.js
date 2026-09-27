const test = require("node:test");
const assert = require("node:assert/strict");
const rules = require("./cosmic-rules.js");

test("objects switch from hazard to absorbable at their own threshold", () => {
  for (const threshold of [1, 3, 7, 15, 18]) {
    assert.equal(rules.isAbsorbable(threshold - 1, threshold), false);
    assert.equal(rules.isAbsorbable(threshold, threshold), true);
    assert.equal(rules.isAbsorbable(threshold + 1, threshold), true);
  }
  assert.equal(rules.isAbsorbable(18, 99), false);
});

test("an absorbable mine does not explode before contact", () => {
  assert.equal(rules.canDetonateMine(2, 3), true);
  assert.equal(rules.canDetonateMine(3, 3), false);
});

test("new threats follow a fast player's scale instead of waiting for late waves", () => {
  assert.equal(rules.canSpawnEnemy(1, 0, 5, 5), false);
  assert.equal(rules.canSpawnEnemy(1, 6, 5, 5), true);
  assert.equal(rules.canSpawnEnemy(5, 5, 5, 5), true);
});

test("gravity remains local and bounded on a small screen", () => {
  assert.deepEqual(rules.matterAttraction(1600, 3700, 390, 844),
    { range: 295, power: 1250 });
  assert.deepEqual(rules.matterAttraction(260, 400, 758, 855),
    { range: 260, power: 400 });
});

test("collision uses current object coordinates", () => {
  assert.equal(rules.collisionDistance(10, 20, 10, 20), 0);
  assert.equal(rules.collisionDistance(13, 24, 10, 20), 5);
});

test("playfield clamp stays defined on narrow screens", () => {
  assert.equal(rules.clampPlayfield(10, 80, 20), 80);
  assert.equal(rules.clampPlayfield(100, 20, 80), 80);
  assert.equal(rules.clampPlayfield(50, 20, 80), 50);
});

test("every scale stage has a science fact", () => {
  assert.equal(rules.facts.length, 19);
  assert.ok(rules.facts.every(fact => fact.length > 20));
});
