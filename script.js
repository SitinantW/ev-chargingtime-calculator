// แปลงชั่วโมงทศนิยม เป็นข้อความ "X ชม. Y นาที"
function formatTime(hoursDecimal) {
    if (!isFinite(hoursDecimal) || hoursDecimal <= 0) {
        return "0 นาที";
    }
    const totalMinutes = Math.round(hoursDecimal * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h === 0) return `${m} นาที`;
    if (m === 0) return `${h} ชม.`;
    return `${h} ชม. ${m} นาที`;
}

// ฟังก์ชันสำหรับปุ่มกดเลือกตัวอย่าง
function setPreset(charger, ac, dc, bat, pct) {
    document.getElementById('chargerKw').value = charger;
    document.getElementById('evAcKw').value = ac;
    document.getElementById('evDcKw').value = dc;
    document.getElementById('batteryKwh').value = bat;
    document.getElementById('chargePercent').value = pct;
    calculate();
}

// ฟังก์ชันคำนวณหลัก
function calculate() {
    const chargerKw = parseFloat(document.getElementById('chargerKw').value) || 0;
    const evAcKw = parseFloat(document.getElementById('evAcKw').value) || 0;
    const evDcKw = parseFloat(document.getElementById('evDcKw').value) || 0;
    const batteryKwh = parseFloat(document.getElementById('batteryKwh').value) || 0;
    const chargePercent = parseFloat(document.getElementById('chargePercent').value) || 0;

    // อัปเดตตัวเลข % และพลังงานที่ต้องเติม
    document.getElementById('percentDisplay').innerText = chargePercent + '%';
    const energyNeeded = batteryKwh * (chargePercent / 100);
    document.getElementById('energyNeeded').innerText = energyNeeded.toFixed(1) + ' kWh';

    // 1. คำนวณฝั่ง AC (ยึดค่าน้อยกว่า + เผื่อ Loss 10%)
    const actualAcKw = Math.min(chargerKw, evAcKw);
    const acTheoHours = actualAcKw > 0 ? energyNeeded / actualAcKw : 0;
    const acRealHours = acTheoHours * 1.10;

    const acRealFormatted = formatTime(acRealHours);
    document.getElementById('acRealKw').innerText = actualAcKw + ' kW';
    document.getElementById('acTheoTime').innerText = formatTime(acTheoHours);
    document.getElementById('acRealTime').innerText = '~' + acRealFormatted;
    document.getElementById('tipTime').innerText = acRealFormatted;

    // 2. คำนวณฝั่ง DC (ยึดค่าน้อยกว่า + เผื่อกราฟตก 15%)
    const actualDcKw = Math.min(chargerKw, evDcKw);
    const dcTheoHours = actualDcKw > 0 ? energyNeeded / actualDcKw : 0;
    const dcRealHours = dcTheoHours * 1.15;

    document.getElementById('dcRealKw').innerText = actualDcKw + ' kW';
    document.getElementById('dcTheoTime').innerText = formatTime(dcTheoHours);
    document.getElementById('dcRealTime').innerText = '~' + formatTime(dcRealHours);
}

// สั่งให้คำนวณทันทีเมื่อเปิดหน้าเว็บครั้งแรก
document.addEventListener('DOMContentLoaded', calculate);
