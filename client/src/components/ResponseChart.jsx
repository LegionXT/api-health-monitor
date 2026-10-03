import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ResponseChart({ history }) {
  const chartData = [...history]
    .reverse()
    .map((check) => ({
      time: new Date(check.checkedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      responseTime: check.responseTime
    }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="response-chart">
      <h4>Response Time</h4>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ResponseChart;