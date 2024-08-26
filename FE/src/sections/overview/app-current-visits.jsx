import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from 'src/components/chart'; // Đây là module Chart và useChart tùy chỉnh của bạn

export default function AppSalesByCounterVisits({ title, subheader, chart, ...other }) {
  const { labels, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '16%',
      },
    },
    fill: {
      type: series.map(i => i.fill),
    },
    labels,
    xaxis: {
      type: 'category',
    },
    yaxis: [
      {
        title: {
          text: 'Sales',
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: value => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(2)} vnđ`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="bar" // Đổi type từ 'line' sang 'bar' để vẽ biểu đồ cột
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppSalesByCounterVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
