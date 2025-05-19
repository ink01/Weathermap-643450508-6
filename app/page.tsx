"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import WaterIcon from "@mui/icons-material/Water";

// Custom styled components
const WeatherCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[8],
}));

const ProvinceButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateX(5px)",
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const provinces: string[] = [
  "นครราชสีมา", "อุบลราชธานี", "ขอนแก่น", "อุดรธานี", "บุรีรัมย์",
  "สุรินทร์", "ศรีสะเกษ", "มหาสารคาม", "ร้อยเอ็ด", "ชัยภูมิ",
  "สกลนคร", "นครพนม", "มุกดาหาร", "ยโสธร", "หนองบัวลำภู",
  "กาฬสินธุ์", "เลย", "หนองคาย", "บึงกาฬ", "อำนาจเจริญ"
];

const provinceCoordinates: Record<string, { lat: number; lon: number }> = {
  // Same coordinates as before
  "กทม": { lat: 14.9798997, lon: 102.0977693 },
  "อุบลราชธานี": { lat: 15.2286861, lon: 104.8564217 },
  "ขอนแก่น": { lat: 16.4419355, lon: 102.8359921 },
  "อุดรธานี": { lat: 17.4138413, lon: 102.7872325 },
  "บุรีรัมย์": { lat: 14.9930017, lon: 103.1029191 },
  "สุรินทร์": { lat: 14.882905, lon: 103.4937107 },
  "ศรีสะเกษ": { lat: 15.1186009, lon: 104.3220095 },
  "มหาสารคาม": { lat: 16.1850896, lon: 103.3026461 },
  "ร้อยเอ็ด": { lat: 16.0538196, lon: 103.6520036 },
  "ชัยภูมิ": { lat: 15.8068173, lon: 102.0315027 },
  "สกลนคร": { lat: 17.1545995, lon: 104.1348365 },
  "นครพนม": { lat: 17.392039, lon: 104.7695508 },
  "มุกดาหาร": { lat: 16.542443, lon: 104.7209151 },
  "ยโสธร": { lat: 15.792641, lon: 104.1452827 },
  "หนองบัวลำภู": { lat: 17.2218247, lon: 102.4260368 },
  "กาฬสินธุ์": { lat: 16.4314078, lon: 103.5058755 },
  "เลย": { lat: 17.4860232, lon: 101.7223002 },
  "หนองคาย": { lat: 17.8782803, lon: 102.7412638 },
  "บึงกาฬ": { lat: 18.3609104, lon: 103.6464463 },
  "อำนาจเจริญ": { lat: 15.8656783, lon: 104.6257774 }
};

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
  rain?: {
    "3h": number;
  };
}

interface WeatherData {
  name: string;
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    description: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

export default function WeatherApp() {
  const theme = useTheme();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedProvince || !provinceCoordinates[selectedProvince]) return;

      setLoading(true);
      const { lat, lon } = provinceCoordinates[selectedProvince];

      try {
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?appid=6f8eb4a6e3b361c93afcd5b49ed84caf&lat=${lat}&lon=${lon}&units=metric&lang=th`
        );
        const weatherJson = await weatherRes.json();
        setWeatherData(weatherJson);

        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?appid=6f8eb4a6e3b361c93afcd5b49ed84caf&lat=${lat}&lon=${lon}&units=metric&lang=th`
        );
        const forecastJson = await forecastRes.json();
        setForecastData(forecastJson.list);
      } catch (error) {
        console.error("โหลดข้อมูลล้มเหลว:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedProvince]);

  const getWeatherIcon = (description: string) => {
    if (description.includes("ฝน")) return <WaterIcon />;
    if (description.includes("เมฆ")) return <OpacityIcon />;
    return <WbSunnyIcon />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom 
        sx={{ 
          fontWeight: "bold", 
          color: theme.palette.primary.main,
          mb: 4 
        }}
      >
        พยากรณ์อากาศภาคอีสาน
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Box 
            sx={{ 
              bgcolor: "background.paper", 
              borderRadius: 2, 
              p: 3, 
              boxShadow: theme.shadows[2] 
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ color: theme.palette.text.primary, fontWeight: "medium" }}
            >
              เลือกจังหวัด
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {provinces.map((province) => (
              <ProvinceButton
                key={province}
                fullWidth
                variant={province === selectedProvince ? "contained" : "outlined"}
                color="primary"
                startIcon={province === selectedProvince ? <WbSunnyIcon /> : null}
                onClick={() => setSelectedProvince(province)}
              >
                {province}
              </ProvinceButton>
            ))}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress size={60} />
            </Box>
          )}

          {weatherData && !loading && (
            <WeatherCard sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {getWeatherIcon(weatherData.weather[0].description)}
                  <Typography variant="h4" sx={{ ml: 2, fontWeight: "bold" }}>
                    {weatherData.name}
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="h6">
                      อุณหภูมิ: {weatherData.main.temp} °C
                    </Typography>
                    <Typography>สูงสุด: {weatherData.main.temp_max} °C</Typography>
                    <Typography>ต่ำสุด: {weatherData.main.temp_min} °C</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography component="div">
                      สภาพอากาศ: 
                      <Chip 
                        label={weatherData.weather[0].description} 
                        size="small" 
                        sx={{ ml: 1, bgcolor: "rgba(255,255,255,0.2)" }}
                      />
                    </Typography>
                    <Typography>
                      ความเร็วลม: {weatherData.wind.speed} m/s <AirIcon fontSize="small" />
                    </Typography>
                    <Typography>
                      พระอาทิตย์ขึ้น: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString("th-TH")}
                    </Typography>
                    <Typography>
                      พระอาทิตย์ตก: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString("th-TH")}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </WeatherCard>
          )}

          {forecastData.length > 0 && (
            <Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ fontWeight: "medium", mb: 3 }}
              >
                พยากรณ์อากาศล่วงหน้า
              </Typography>
              <StyledTableContainer>
  <Table>
    <TableHead>
      <TableRow sx={{ bgcolor: theme.palette.primary.light }}>
        <TableCell>วัน/เวลา</TableCell>
        <TableCell>อุณหภูมิ (°C)</TableCell>
        <TableCell>ความชื้น (%)</TableCell>
        <TableCell>สภาพอากาศ</TableCell>
        <TableCell>ปริมาณฝน (mm)</TableCell>
        <TableCell>ความเร็วลม (m/s)</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {forecastData.map((item, index) => (
        <TableRow 
          key={index} 
          hover 
          sx={{ "&:hover": { bgcolor: theme.palette.action.hover } }}
        >
          <TableCell>
            {new Date(item.dt_txt).toLocaleString("th-TH", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </TableCell>
          <TableCell>{item.main.temp.toFixed(1)}</TableCell>
          <TableCell>{item.main.humidity}</TableCell>
          <TableCell>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {getWeatherIcon(item.weather[0].description)}
              {item.weather[0].description}
            </Box>
          </TableCell>
          <TableCell>{item.rain?.["3h"] ?? 0}</TableCell>
          <TableCell>{item.wind.speed}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</StyledTableContainer>
            </Box>
          )}

          {!weatherData && !loading && (
            <Box 
              sx={{ 
                bgcolor: "background.paper", 
                p: 4, 
                borderRadius: 2, 
                textAlign: "center" 
              }}
            >
              <WbSunnyIcon sx={{ fontSize: 60, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                กรุณาเลือกจังหวัดเพื่อดูพยากรณ์อากาศ
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

