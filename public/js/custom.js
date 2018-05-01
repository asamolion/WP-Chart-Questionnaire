function getBoxWidth(labelOpts, fontSize) {
    return labelOpts.usePointStyle ? fontSize * Math.SQRT2 : labelOpts.boxWidth;
}

Chart.NewLegend = Chart.Legend.extend({
    afterFit: function() {
        this.height = this.height + 50;
    }
});

function createNewLegendAndAttach(chartInstance, legendOpts) {
    var legend = new Chart.NewLegend({
        ctx: chartInstance.chart.ctx,
        options: legendOpts,
        chart: chartInstance
    });

    if (chartInstance.legend) {
        Chart.layoutService.removeBox(chartInstance, chartInstance.legend);
        delete chartInstance.newLegend;
    }

    chartInstance.newLegend = legend;
    Chart.layoutService.addBox(chartInstance, legend);
}

// Register the legend plugin
Chart.plugins.register({
    beforeInit: function(chartInstance) {
        var legendOpts = chartInstance.options.legend;

        if (legendOpts) {
            createNewLegendAndAttach(chartInstance, legendOpts);
        }
    },
    beforeUpdate: function(chartInstance) {
        var legendOpts = chartInstance.options.legend;

        if (legendOpts) {
            legendOpts = Chart.helpers.configMerge(
                Chart.defaults.global.legend,
                legendOpts
            );

            if (chartInstance.newLegend) {
                chartInstance.newLegend.options = legendOpts;
            } else {
                createNewLegendAndAttach(chartInstance, legendOpts);
            }
        } else {
            Chart.layoutService.removeBox(
                chartInstance,
                chartInstance.newLegend
            );
            delete chartInstance.newLegend;
        }
    },
    afterEvent: function(chartInstance, e) {
        var legend = chartInstance.newLegend;
        if (legend) {
            legend.handleEvent(e);
        }
    }
});

(function($) {
    "use strict";
    var chartCanvas = document.getElementById("pcq-chart");
    var ctx = chartCanvas.getContext("2d");

    var $steps = $(".step");
    var currentStep = 0;
    $steps.addClass("hidden");

    var colorPresets = [
        "rgba(184, 14, 1, 0.5)",
        "rgba(255, 132, 29, 0.5)",
        "rgba(234, 212, 37, 0.5)",
        "rgba(13, 172, 64, 0.5)",
        "rgba(22, 125, 238, 0.5)",
        "rgba(93, 33, 143, 0.5)",
        "rgba(234, 94, 150, 0.5)"
    ];

    $("input:radio").on("click", function() {
        var $this = $(this);

        $this
            .parents(".select-box")
            .siblings(".select-box")
            .removeClass("active");
        $this.parents(".select-box").addClass("active");
    });

    $(document).ready(function() {
        $($steps[currentStep]).removeClass("hidden");

        $(".step-butn").on("click", function(evt) {
            evt.preventDefault();

            showNextStep();
        });

        $(".select-box > input").on("click", function() {
            var $this = $(this);

            addDatatToChart($this.val(), $this.attr("name"));
            showNextStep();
        });

        $(".select-box > span").on("click", function() {
            $(this)
                .siblings("input")
                .trigger("click");
        });
    });

    function showNextStep() {
        $steps.addClass("hidden");
        currentStep++;
        $($steps[currentStep]).removeClass("hidden");
    }

    function showPrevStep() {
        $steps.addClass("hidden");
        currentStep--;
        $($steps[currentStep]).removeClass("hidden");
    }

    function createGradient(color) {
        var xCoor = $(chartCanvas).width() / 2;
        var yCoor = $(chartCanvas).height() / 2 + 35;

        var gradient = ctx.createRadialGradient(
            xCoor,
            yCoor,
            0.0,
            xCoor,
            yCoor,
            xCoor / 4
        );

        gradient.addColorStop(0.0, "white");
        gradient.addColorStop(1.0, color);

        return gradient;
    }

    var myChart = new Chart(ctx, {
        type: "polarArea",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Life",
                    data: [],
                    backgroundColor: [],
                    borderColor: [
                        "rgba(184, 14, 1, 1)",
                        "rgba(255, 132, 29, 1)",
                        "rgba(234, 212, 37, 1)",
                        "rgba(13, 172, 64, 1)",
                        "rgba(22, 125, 238, 1)",
                        "rgba(93, 33, 143, 1)",
                        "rgba(234, 94, 150, 1)"
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            scale: {
                gridLines: {
                    color: "#FFF"
                },
                ticks: {
                    display: false
                }
            },
            legend: {
                labels: {
                    boxWidth: 30,
                    padding: 5
                }
            },
            responsive: true
        }
    });

    function addDatatToChart(value, label) {
        myChart.data.datasets[0].data.push(value);
        myChart.data.labels.push(label);

        myChart.data.datasets[0].backgroundColor.push(
            createGradient(colorPresets.shift())
        );
        myChart.update();
    }
})(jQuery);
