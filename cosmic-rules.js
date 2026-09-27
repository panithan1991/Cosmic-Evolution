/* Game mass is a progression score, not a physical mass in kilograms. */
(function (root) {
  "use strict";

  const facts = [
    "ดาวเคราะห์หินเป็นวัตถุที่โคจรรอบดาวฤกษ์ ไม่ได้เปลี่ยนเป็นดาวฤกษ์เอง",
    "ดาวเคราะห์แก๊สมีชั้นบรรยากาศหนา แต่ยังไม่เกิดฟิวชันไฮโดรเจน",
    "ดาวแคระน้ำตาลมีมวลไม่พอให้ฟิวชันไฮโดรเจนดำเนินต่อเนื่อง",
    "ดาวฤกษ์ลำดับหลักส่องแสงจากฟิวชันไฮโดรเจนในแกนกลาง",
    "ช่วงลำดับหลัก ดาวฤกษ์มวลสูงมักร้อนและมีสีขาวหรือฟ้า",
    "ดาวมหายักษ์มวลสูงอาจจบชีวิตด้วยการระเบิดซูเปอร์โนวา",
    "ซากซูเปอร์โนวาคือกลุ่มแก๊สที่ขยายตัว ไม่ใช่ดาวชนิดใหม่",
    "ดาวนิวตรอนเป็นซากแกนดาวฤกษ์มวลสูงเพียงหนึ่งทางเลือก",
    "หลุมดำมวลดาวฤกษ์เป็นซากอีกทางเลือก ไม่จำเป็นต้องผ่านดาวนิวตรอน",
    "หลุมดำเติบโตได้จากการสะสมสสารและการรวมตัวกับหลุมดำอื่น",
    "กาแล็กซีประกอบด้วยดาว แก๊ส ฝุ่น และสสารมืด; หลุมดำไม่กลายเป็นกาแล็กซี",
    "กาแล็กซีเกลียวเป็นรูปทรงชนิดหนึ่ง ไม่ใช่ขั้นอายุของทุกกาแล็กซี",
    "คานกลางเป็นลักษณะของกาแล็กซีเกลียวบางแห่ง ไม่ใช่ขั้นต่อไปเสมอ",
    "กาแล็กซีสองแห่งอาจโคจรและมีปฏิสัมพันธ์กันด้วยแรงโน้มถ่วง",
    "กาแล็กซีหลายแห่งรวมเป็นกลุ่มได้ แต่คะแนน Mass ในเกมไม่ใช่หน่วยจริง",
    "กลุ่มกาแล็กซีคือระบบของกาแล็กซีที่แรงโน้มถ่วงยึดไว้",
    "กระจุกกาแล็กซีมีสมาชิกมากกว่ากลุ่มกาแล็กซีทั่วไป",
    "ซูเปอร์คลัสเตอร์เป็นโครงสร้างขนาดใหญ่ของกลุ่มและกระจุกกาแล็กซี",
    "ใยจักรวาลคือรูปแบบการกระจายตัวขนาดใหญ่ ไม่ใช่สิ่งมีชีวิตหรือดาวดวงเดียว"
  ];

  function isAbsorbable(currentStage, absorbStage) {
    return currentStage >= absorbStage;
  }

  function collisionDistance(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function clampPlayfield(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
  }

  function canDetonateMine(currentStage, absorbStage) {
    return !isAbsorbable(currentStage, absorbStage);
  }

  function canSpawnEnemy(wave, currentStage, unlockWave, unlockStage) {
    return currentStage >= unlockStage &&
      (wave >= unlockWave || currentStage > unlockStage);
  }

  function matterAttraction(range, power, width, height) {
    return {
      range: Math.min(range, Math.min(width, height) * .5 + 100),
      power: Math.min(power, 1250)
    };
  }

  const api = { facts, isAbsorbable, collisionDistance, clampPlayfield,
    canDetonateMine, canSpawnEnemy, matterAttraction };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CosmicRules = api;
})(typeof window !== "undefined" ? window : globalThis);
