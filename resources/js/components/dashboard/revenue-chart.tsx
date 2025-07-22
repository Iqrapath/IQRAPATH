import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{ name: string; value: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card className="lg:col-span-2 bg-white border-1 rounded-3xl shadow-sm overflow-hidden h-full">
      <CardContent className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">Revenue Summary</h2>
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[140px] h-9 text-sm border-gray-200 bg-white">
              <SelectValue placeholder="This Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart Area with Recharts */}
        <div className="flex-1 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minHeight={350}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="5 5"
                horizontal={true}
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => {
                  if (value === 0) return '0';
                  if (value === 250000) return '250K';
                  if (value === 500000) return '500K';
                  if (value === 750000) return '750K';
                  if (value === 1000000) return '1000K';
                  return '';
                }}
                domain={[0, 1000000]}
                ticks={[0, 250000, 500000, 750000, 1000000]}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '8px 12px',
                }}
                itemStyle={{ color: '#2c7870' }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ffd89b"
                strokeWidth={3}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#2c7870',
                  stroke: 'white',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
