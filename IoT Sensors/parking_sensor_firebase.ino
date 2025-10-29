#include <WiFi.h>
#include <HTTPClient.h>

// WiFi credentials
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""

// Firebase Realtime Database URL
// e.g., "https://your-database-name.firebaseio.com"

#define DATABASE_URL "" 

// Ultrasonic Sensor Pins (for 5 slots)
#define TRIG1 12
#define ECHO1 13
#define TRIG2 14
#define ECHO2 27
#define TRIG3 26
#define ECHO3 25
#define TRIG4 33
#define ECHO4 32
#define TRIG5 18
#define ECHO5 19

void setup()
{
  Serial.begin(115200);

  // Set up all TRIG as OUTPUT, ECHO as INPUT
  pinMode(TRIG1, OUTPUT);
  pinMode(ECHO1, INPUT);
  pinMode(TRIG2, OUTPUT);
  pinMode(ECHO2, INPUT);
  pinMode(TRIG3, OUTPUT);
  pinMode(ECHO3, INPUT);
  pinMode(TRIG4, OUTPUT);
  pinMode(ECHO4, INPUT);
  pinMode(TRIG5, OUTPUT);
  pinMode(ECHO5, INPUT);

  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n WiFi connected!");
}

float getDistance(int trig, int echo)
{
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long duration = pulseIn(echo, HIGH, 25000); // 25ms timeout for stability
  return duration * 0.034 / 2;                // Convert to cm
}

void loop()
{
  // Get distances from 5 sensors
  float d1 = getDistance(TRIG1, ECHO1);
  float d2 = getDistance(TRIG2, ECHO2);
  float d3 = getDistance(TRIG3, ECHO3);
  float d4 = getDistance(TRIG4, ECHO4);
  float d5 = getDistance(TRIG5, ECHO5);

  //  Occupancy logic (distance < 10 cm = occupied)
  bool s1 = d1 < 10;
  bool s2 = d2 < 10;
  bool s3 = d3 < 10;
  bool s4 = d4 < 10;
  bool s5 = d5 < 10;

  //  Build JSON payload
  String json = "{";
  json += "\"slot1\":{\"occupied\":" + String(s1 ? "true" : "false") + ",\"distance\":" + String(d1, 1) + "},";
  json += "\"slot2\":{\"occupied\":" + String(s2 ? "true" : "false") + ",\"distance\":" + String(d2, 1) + "},";
  json += "\"slot3\":{\"occupied\":" + String(s3 ? "true" : "false") + ",\"distance\":" + String(d3, 1) + "},";
  json += "\"slot4\":{\"occupied\":" + String(s4 ? "true" : "false") + ",\"distance\":" + String(d4, 1) + "},";
  json += "\"slot5\":{\"occupied\":" + String(s5 ? "true" : "false") + ",\"distance\":" + String(d5, 1) + "},";
  json += "\"lastUpdate\":\"" + String(millis() / 1000) + "s\"";
  json += "}";

  //  Send to Firebase
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    String url = String(DATABASE_URL) + "/slots.json";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    int httpResponse = http.PUT(json);
    Serial.print("📡 Firebase response: ");
    Serial.println(httpResponse);

    if (httpResponse > 0)
    {
      Serial.println(" Data sent successfully!");
      Serial.println(json);
    }
    else
    {
      Serial.print(" HTTP Error: ");
      Serial.println(httpResponse);
    }

    http.end();
  }
  else
  {
    Serial.println(" WiFi disconnected!");
  }

  delay(4000); // Update every 4 seconds
}
