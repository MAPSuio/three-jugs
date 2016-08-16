var angular = require('angular');
require('angular-bootstrap');

var ThreeJugs = angular.module('ThreeJugs', [
    'ui.bootstrap'
]).controller('ThreeJugsController', function ($scope) {
    function makeJugs() {
        var jugs = [];

        for (var i = 0; i < arguments.length; i++) {
            jugs.push({
                contents: 0,
                capacity: arguments[i],
                label: function() {
                    return this.contents + '/' + this.capacity;
                },
                selected: false,
                draw: function() {
                    return drawJug(this);
                },
                clicked: function() {
                    if ($scope.numberSelected() == 0) {
                        if (this.contents > 0) {
                            this.selected = true;
                        }
                    } else if ($scope.numberSelected() == 1) {
                        var fromJug = $scope.alreadySelected()
                        var toJug = this;

                        if (fromJug === toJug) {
                            this.selected = false;
                            return;
                        }

                        var amount = Math.min(fromJug.contents, toJug.capacity - toJug.contents);

                        if (amount > 0) {
                            toJug.contents += amount;
                            fromJug.contents -= amount;
                            $scope.clearSelected();
                            $scope.moves.push("Poured " + amount + " liters from " + fromJug.capacity + " to " + toJug.capacity + ".");
                        } else {
                            fromJug.selected = false;
                            toJug.selected = true;
                        }
                    }
                },
            });
        }

        /* Set first jug to have same contents as capacity. */
        jugs[0].contents = jugs[0].capacity;

        return jugs;
    }

    $scope.jugs = makeJugs(12, 8, 5);

    $scope.numberSelected = function() {
        var count = 0;

        for (var i in $scope.jugs) {
            if ($scope.jugs[i].selected) {
                count += 1;
            }
        }

        return count;
    }

    $scope.success = function() {
        var count = 0;

        for (var i in $scope.jugs) {
            if ($scope.jugs[i].contents == 6) {
                count += 1;
            }
        }

        return count == 2;
    }

    $scope.alreadySelected = function() {
        for (var i in $scope.jugs) {
            if ($scope.jugs[i].selected) {
                return $scope.jugs[i];
            }
        }
    }

    $scope.clearSelected = function() {
        for (var i in $scope.jugs) {
            $scope.jugs[i].selected = false;
        }
    }

    $scope.moves = [];
    $scope.move = function () {
        var selectedJugs = [];

        for (var idx in $scope.jugs) {
            var jug = $scope.jugs[idx];

            if (jug.selected) {
                selectedJugs.push(jug);
            }
        }

        $scope.moves.push(selectedJugs)
    };
}).filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);

// Based on https://jsfiddle.net/rfornal/A2V92/
function drawJug(p) {
    var html = "";

    var x = 15 * (12 - p.capacity);
    var iPct = (230-x) * (1 - (p.contents / p.capacity));

    // OPEN SVG
    html += "<svg width='110px' height='250px' viewBox='0 0 110 250'>\n";

    // Background Percentage
    html += "<g fill='#dcd9cd' stroke='#b0aea4' stroke-width='3'>\n";
    html += "<path d='M 5 " + (iPct+x) + " Q 55 " + (iPct + 25 + x) + " 105 " + (iPct+x) + " L 105 250";
    html += "           L 5 250 z' />\n";
    html += "</g>\n";

    // White Outer with Jug Shaped Inner Cleared
    html += "<g fill-rule='evenodd' fill='white' stroke='white' stroke-width='0'>\n";
    html += "<path d='M 0 0 L 110 0 L 110 250 L 0 250 L 0 0 z\n";
    html += "         M 30 " + (10+x) + " L 80 " + (10+x) + " L 80 " + (40+x) + " Q 90 " + (60+x) + " 100 " + (70+x) + " L 100 230 Q 55 250 10 230 L 10 " + (70+x) + "\n";
    html += "           Q 20 " + (60+x) + " 30 " + (40+x) + " z' />\n";
    html += "</g>\n";

    // Black Jug Border with Transparent Center
    html += "<g stroke='black' stroke-width='3' fill-opacity='0.0'>\n";
    html += "<path d='M 30 " + (10+x) + " L 80 " + (10+x) + " L 80 " + (40+x) + " Q 90 " + (60+x) + " 100 " + (70+x) + " L 100 230 Q 55 250 10 230 L 10 " + (70+x);
    html += "           Q 20 " + (60+x) + " 30 " + (40+x) + " z' />\n";
    html += "</g>\n";

    // Upper Ellipse
    html += "<ellipse cx='55' cy='" + (10+x) + "' rx='25' ry='5' style='fill:#ccc; stroke:black;";
    html += "         stroke-width:3'/>\n";

    // Upper Dash
    html += "<path d='M 30 " + (40+x) + " Q 55 " + (48+x) + " 80 " + (40+x) + "' stroke='#555555' stroke-dasharray='3,3' stroke-width='2'";
    html += "fill='none' />\n";

    // Lower Dash
    html += "<path d='M 10 " + (70+x) + " Q 55 " + (90+x) + " 100 " + (70+x) + "' stroke='#555555' stroke-dasharray='3,3' stroke-width='2'";
    html += "fill='none' />\n";

    // CLOSE SVG
    html += "</svg>\n";

    return html;
}
