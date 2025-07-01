import React from 'react';

const EvolutionChart = ({ data, metric, title, color = '#4F46E5', unit = '', height = 200 }) => {
    if (!data || data.length < 2) {
        return (
            <div className="chart-placeholder">
                <p>Dados insuficientes para gerar o gráfico</p>
            </div>
        );
    }

    // Preparar dados para o gráfico
    const chartData = data.map((item, index) => ({
        value: parseFloat(item[metric]),
        date: new Date(item.date),
        index
    }));

    // Calcular valores min e max para escala
    const values = chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const padding = (maxValue - minValue) * 0.1 || 1; // 10% de padding ou 1 se não há variação
    const adjustedMin = minValue - padding;
    const adjustedMax = maxValue + padding;

    // Dimensões do gráfico
    const width = 400;
    const chartHeight = height - 60; // Espaço para labels
    const chartPadding = { top: 20, right: 20, bottom: 40, left: 50 };

    // Função para calcular posição Y
    const getY = (value) => {
        return chartPadding.top + ((adjustedMax - value) / (adjustedMax - adjustedMin)) * chartHeight;
    };

    // Função para calcular posição X
    const getX = (index) => {
        return chartPadding.left + (index / (chartData.length - 1)) * (width - chartPadding.left - chartPadding.right);
    };

    // Gerar pontos para a linha
    const points = chartData.map((d, index) => `${getX(index)},${getY(d.value)}`).join(' ');

    // Formatação de valores
    const formatValue = (value) => {
        if (unit === '%') return `${Math.round(value)}%`;
        if (unit === 'kg') return `${Math.round(value)}kg`;
        if (unit === 'cm') return `${Math.round(value)}cm`;
        return Math.round(value);
    };

    return (
        <div className="evolution-chart-container">
            <h4 className="chart-title">{title}</h4>
            
            <div className="chart-wrapper">
                <svg width={width} height={height} className="evolution-chart-svg">
                    {/* Grade de fundo */}
                    <defs>
                        <pattern id={`grid-${metric}`} width="40" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
                        </pattern>
                    </defs>
                    <rect 
                        x={chartPadding.left} 
                        y={chartPadding.top} 
                        width={width - chartPadding.left - chartPadding.right} 
                        height={chartHeight} 
                        fill={`url(#grid-${metric})`}
                    />

                    {/* Linha de conexão */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        className="chart-line"
                    />

                    {/* Pontos de dados */}
                    {chartData.map((d, index) => (
                        <g key={index}>
                            <circle
                                cx={getX(index)}
                                cy={getY(d.value)}
                                r="4"
                                fill={color}
                                className="chart-point"
                            />
                            {/* Tooltip invisível para hover */}
                            <circle
                                cx={getX(index)}
                                cy={getY(d.value)}
                                r="8"
                                fill="transparent"
                                className="chart-point-hover"
                                data-value={formatValue(d.value)}
                                data-date={d.date.toLocaleDateString('pt-BR')}
                            />
                        </g>
                    ))}

                    {/* Eixo Y (valores) */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                        const value = adjustedMin + (adjustedMax - adjustedMin) * ratio;
                        const y = chartPadding.top + chartHeight * (1 - ratio);
                        return (
                            <g key={index}>
                                <line
                                    x1={chartPadding.left - 5}
                                    y1={y}
                                    x2={chartPadding.left}
                                    y2={y}
                                    stroke="#666"
                                    strokeWidth="1"
                                />
                                <text
                                    x={chartPadding.left - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="chart-label"
                                    fontSize="11"
                                    fill="#666"
                                >
                                    {formatValue(value)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Eixo X (datas) */}
                    {chartData.map((d, index) => {
                        if (index % Math.ceil(chartData.length / 4) === 0 || index === chartData.length - 1) {
                            const x = getX(index);
                            return (
                                <g key={index}>
                                    <line
                                        x1={x}
                                        y1={chartPadding.top + chartHeight}
                                        x2={x}
                                        y2={chartPadding.top + chartHeight + 5}
                                        stroke="#666"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={x}
                                        y={chartPadding.top + chartHeight + 18}
                                        textAnchor="middle"
                                        className="chart-label"
                                        fontSize="10"
                                        fill="#666"
                                    >
                                        {d.date.toLocaleDateString('pt-BR', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </text>
                                </g>
                            );
                        }
                        return null;
                    })}
                </svg>
            </div>

            {/* Estatísticas do gráfico */}
            <div className="chart-stats">
                <div className="stat-item">
                    <span className="stat-label">Inicial:</span>
                    <span className="stat-value">{formatValue(chartData[0].value)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Atual:</span>
                    <span className="stat-value">{formatValue(chartData[chartData.length - 1].value)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Variação:</span>
                    <span className={`stat-value ${chartData[chartData.length - 1].value > chartData[0].value ? 'positive' : 'negative'}`}>
                        {chartData[chartData.length - 1].value > chartData[0].value ? '+' : ''}
                        {formatValue(chartData[chartData.length - 1].value - chartData[0].value)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EvolutionChart;
