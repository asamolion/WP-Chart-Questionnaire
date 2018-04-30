(function($) {
    var ctx = document.getElementById("pcq-chart").getContext("2d");

    var $steps = $(".step");
    var currentStep = 0;
    $steps.addClass("hidden");

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
            $this = $(this);

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

    var myChart = new Chart(ctx, {
        type: "polarArea",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Life",
                    data: [],
                    backgroundColor: [
                        "rgba(184, 14, 1, 0.8)",
                        "rgba(255, 132, 29, 0.8)",
                        "rgba(234, 212, 37, 0.8)",
                        "rgba(13, 172, 64, 0.8)",
                        "rgba(22, 125, 238, 0.8)",
                        "rgba(93, 33, 143, 0.8)",
                        "rgba(234, 94, 150, 0.8)"
                    ],
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
                display: false
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
        myChart.update();
    }
})(jQuery);
