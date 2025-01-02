import React, { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const TanggalPengerjaan = ({ setDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setDate(dayjs(newValue).format("YYYY-MM-DD"));
  };

  return (
    <div className="tanggalPengerjaan">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Tanggal Pengerjaan"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TanggalPengerjaan;
