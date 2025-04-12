
export const generateDemoData = (selectedDate: Date, deviceId: string) => {
  const singleDeviceData = [];
  
  for (let i = 0; i < 24; i++) {
    const date = new Date(selectedDate);
    date.setHours(i);
    date.setMinutes(0);
    date.setSeconds(0);
    
    singleDeviceData.push({
      timestamp: date.toISOString(),
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 20,
      battery: 75 + Math.random() * 25,
      signal: 8 + Math.random() * 2,
    });
  }
  
  return singleDeviceData;
};
