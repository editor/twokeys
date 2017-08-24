// Generated by CoffeeScript 1.12.7
(function() {
  var Twokeys;

  Twokeys = function() {
    this.smoothed = false;
    return this;
  };

  Twokeys.prototype.DEFAULT_MAX_RANDOM_INTEGER = 100;

  Twokeys.prototype.DEFAULT_MIN_RANDOM_INTEGER = 0;

  Twokeys.prototype.DEFAULT_RANDOM_SERIES_COUNT = 1000;

  Twokeys.prototype.DEFAULT_OUTLIER_MULTIPLE = 1.5;

  Twokeys.prototype.DEFAULT_JITTER_MULTIPLIER = 1;

  Twokeys.prototype.DEFAULT_SPLIT_PASSES = 2;

  Twokeys.prototype.DEFAULT_MAX_RANDOM_DIMENSIONALITY = 2;

  Twokeys.prototype._randomInteger = function(max) {
    if (max == null) {
      max = Twokeys.prototype.DEFAULT_MAX_RANDOM_INTEGER;
    }
    return Math.floor(Math.random() * max);
  };

  Twokeys.prototype._randomSeries = function(count, max, series) {
    var j, num, ref;
    if (count == null) {
      count = Twokeys.prototype.DEFAULT_RANDOM_SERIES_COUNT;
    }
    if (max == null) {
      max = Twokeys.prototype.DEFAULT_MAX_RANDOM_INTEGER;
    }
    if (series == null) {
      series = [];
    }
    for (num = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; num = 1 <= ref ? ++j : --j) {
      series.push(Twokeys.prototype._randomInteger(max));
    }
    return series;
  };

  Twokeys.prototype._randomPoint = function(dimension, max) {
    var i, j, point, ref;
    if (dimension == null) {
      dimension = Twokeys.prototype.DEFAULT_MAX_RANDOM_DIMENSIONALITY;
    }
    if (max == null) {
      max = Twokeys.prototype.DEFAULT_MAX_RANDOM_INTEGER;
    }
    point = [];
    for (i = j = 0, ref = dimension - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      point.push(Math.floor((Math.random() * (max / 10)) % max));
    }
    return point;
  };

  Twokeys.prototype._randomPoints = function(count, dimension, max) {
    var j, num, points, ref;
    if (count == null) {
      count = Twokeys.prototype.DEFAULT_RANDOM_SERIES_COUNT;
    }
    if (dimension == null) {
      dimension = Twokeys.prototype.DEFAULT_MAX_RANDOM_DIMENSIONALITY;
    }
    if (max == null) {
      max = Twokeys.prototype.DEFAULT_MAX_RANDOM_INTEGER;
    }
    points = [];
    for (num = j = 1, ref = count; 1 <= ref ? j <= ref : j >= ref; num = 1 <= ref ? ++j : --j) {
      points.push(Twokeys.prototype._randomPoint(this.dimension, max));
    }
    return points;
  };

  Twokeys.prototype.Series = function(options) {
    var base1;
    if (options == null) {
      options = {};
    }
    if (this.data == null) {
      this.data = {};
    }
    this.data.original = options.data;
    if ((base1 = this.data).original == null) {
      base1.original = Twokeys.prototype._randomSeries.apply(this, []);
    }
    return this;
  };

  Twokeys.prototype.Series.prototype.sorted = function() {
    var ref, ref1, ref2, ref3;
    if (((ref = this.data) != null ? ref.sorted : void 0) == null) {
      if ((ref1 = this.data) != null) {
        ref1.sorted = this._getSorted((ref2 = this.data) != null ? ref2.original : void 0);
      }
    }
    return (ref3 = this.data) != null ? ref3.sorted : void 0;
  };

  Twokeys.prototype.Series.prototype._getSorted = function(arr) {
    if (arr == null) {
      arr = [];
    }
    arr = arr.slice(0);
    arr.sort(function(a, b) {
      if (a > b) {
        return 1;
      } else if (a === b) {
        return 0;
      } else {
        return -1;
      }
    });
    return arr;
  };

  Twokeys.prototype.Series.prototype.median = function() {
    var description;
    this.sorted();
    if (this.data == null) {
      this.data = {};
    }
    if (this.data.median == null) {
      this.data.median = this._getMedian(this.data.sorted);
    }
    if (this.data.medianDepth == null) {
      this.data.medianDepth = this._getMedianDepth(this.data.sorted);
    }
    return description = {
      datum: this.data.median,
      depth: this.data.medianDepth
    };
  };

  Twokeys.prototype.Series.prototype.mean = function() {
    var ref, ref1, ref2;
    if (((ref = this.data) != null ? ref.mean : void 0) == null) {
      if ((ref1 = this.data) != null) {
        ref1.mean = this._getMean((ref2 = this.data) != null ? ref2.original : void 0);
      }
    }
    return this.data.mean;
  };

  Twokeys.prototype.Series.prototype._getMean = function(arr) {
    var i, j, len, num, total;
    if (arr == null) {
      arr = [];
    }
    if (!arr.length || 0 === arr.length) {
      return 0/0;
    }
    total = 0;
    i = 0;
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      num = arr[i];
      total += num;
    }
    return total / i;
  };

  Twokeys.prototype.Series.prototype.mode = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.mode : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.mode = this._getMode(this.data.sorted);
      }
    }
    return this.data.mode;
  };

  Twokeys.prototype.Series.prototype._getMode = function(data, best) {
    var arr, idx, j, last, len, result, run, val;
    if (data == null) {
      data = [];
    }
    if (best == null) {
      best = [];
    }
    if (!data.length || !best.length || 0 === data.length || 0 === best.length) {
      return [];
    }
    data = data.slice(0);
    best = best.slice(0);
    if ('undefined' === typeof best[0]) {
      best = [[]];
    }
    if (true !== (data.length > 0)) {
      return best;
    } else {
      last = null;
      run = [];
      idx = 0;
      while (data.length) {
        val = data.shift();
        if (null === last) {
          run.push(val);
          last = val;
        } else if (val !== last) {
          if ('undefined' === typeof best[0] || run.length > best[0].length) {
            best = [run];
          } else if (run.length === best[0].length) {
            best.push(run);
          }
          return this._getMode(data, best);
        } else {
          run.push(val);
        }
      }
    }
    arr = [];
    for (j = 0, len = best.length; j < len; j++) {
      val = best[j];
      arr.push(val[0]);
    }
    result = {
      count: best[0].length,
      data: arr
    };
    return result;
  };

  Twokeys.prototype.Series.prototype.extremes = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.extremes : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.extremes = this._getExtremes(this.data.sorted);
      }
    }
    return this.data.extremes;
  };

  Twokeys.prototype.Series.prototype._getExtremes = function(data) {
    if (data == null) {
      data = [];
    }
    if (!data.length || 0 === data.length) {
      return [];
    } else {
      return [data[0], data[data.length - 1]];
    }
  };

  Twokeys.prototype.Series.prototype.counts = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.counts : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.counts = this._getCounts(this.data.sorted);
      }
    }
    return this.data.counts;
  };

  Twokeys.prototype.Series.prototype._getCounts = function(data, counts) {
    var count, found, idx, j, len, val;
    if (data == null) {
      data = [];
    }
    if (counts == null) {
      counts = [];
    }
    data = data.slice(0);
    counts = counts.slice(0);
    while (data.length) {
      val = data.shift();
      found = false;
      for (idx = j = 0, len = counts.length; j < len; idx = ++j) {
        count = counts[idx];
        if (val === count[0]) {
          counts[idx][1]++;
          found = true;
        }
      }
      if (false === found) {
        counts.push([val, 1]);
      }
      return this._getCounts(data, counts);
    }
    return counts;
  };

  Twokeys.prototype.Series.prototype._getMedianDepth = function(arr, offset) {
    if (arr == null) {
      arr = [];
    }
    if (offset == null) {
      offset = 0;
    }
    if (!arr.length || 0 === arr.length) {
      return 0/0;
    } else {
      return offset + ((arr.length + 1) / 2);
    }
  };

  Twokeys.prototype.Series.prototype._getMedian = function(arr) {
    var result;
    if (arr == null) {
      arr = [];
    }
    arr = arr.slice(0);
    if (!arr.length || 0 === arr.length) {
      return 0/0;
    }
    result = null;
    switch (arr.length) {
      case 0:
        result = 0;
        break;
      case 2:
        result = (arr[0] + arr[1]) / 2;
        break;
      case 1:
        result = arr[0];
        break;
      default:
        arr.shift();
        arr.pop();
        result = Twokeys.prototype.Series.prototype._getMedian(arr);
    }
    return result;
  };

  Twokeys.prototype.Series.prototype.hinges = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.hinges : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.hinges = this._getHinges(this.data.sorted);
      }
    }
    return this.data.hinges;
  };

  Twokeys.prototype.Series.prototype._getHinges = function(arr, hinges, result) {
    var fragment, how_many, j, per, ref, step, total;
    if (arr == null) {
      arr = [];
    }
    if (hinges == null) {
      hinges = 2;
    }
    if (result == null) {
      result = [];
    }
    arr = arr.slice(0);
    total = arr.length;
    if (0 !== hinges % 2) {
      hinges++;
    }
    if (true !== (total > hinges)) {
      return result;
    }
    if (true !== (hinges > 0)) {
      return result;
    }
    per = Math.floor(total / hinges);
    how_many = Math.floor(total / per) - 1;
    for (step = j = 0, ref = how_many; 0 <= ref ? j <= ref : j >= ref; step = 0 <= ref ? ++j : --j) {
      fragment = arr.slice(step * per, (step * per) + per);
      result.push({
        datum: this._getMedian(fragment),
        depth: this._getMedianDepth(fragment, step * per)
      });
    }
    return result;
  };

  Twokeys.prototype.Series.prototype.iqr = function() {
    var ref, ref1, ref2;
    if (((ref = this.data) != null ? ref.iqr : void 0) == null) {
      this.hinges();
      if ((ref1 = this.data) != null) {
        ref1.iqr = this._getIQR(this.data.hinges);
      }
    }
    return (ref2 = this.data) != null ? ref2.iqr : void 0;
  };

  Twokeys.prototype.Series.prototype._getIQR = function(hinges) {
    var first, ref, ref1, second;
    if (hinges == null) {
      hinges = [];
    }
    first = (ref = hinges[0]) != null ? ref.datum : void 0;
    second = (ref1 = hinges[1]) != null ? ref1.datum : void 0;
    if ((first == null) || (second == null)) {
      return 0/0;
    } else {
      return Math.abs(first - second);
    }
  };

  Twokeys.prototype.Series.prototype.fences = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.fences : void 0) == null) {
      this.iqr();
      if ((ref1 = this.data) != null) {
        ref1.fences = this._getFences();
      }
    }
    return this.data.fences;
  };

  Twokeys.prototype.Series.prototype._getFences = function(multiple) {
    var base, extra;
    if (multiple == null) {
      multiple = Twokeys.prototype.DEFAULT_OUTLIER_MULTIPLE;
    }
    base = this.data.median;
    extra = this.data.iqr * multiple;
    if (!base || !extra) {
      return [];
    } else {
      return [base - extra, base + extra];
    }
  };

  Twokeys.prototype.Series.prototype.outer = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.outer : void 0) == null) {
      this.iqr();
      if ((ref1 = this.data) != null) {
        ref1.outer = this._getOuter();
      }
    }
    return this.data.outer;
  };

  Twokeys.prototype.Series.prototype._getOuter = function(multiple) {
    var base, extra;
    if (multiple == null) {
      multiple = Twokeys.prototype.DEFAULT_OUTLIER_MULTIPLE;
    }
    base = this.data.median;
    if (!base) {
      return [];
    }
    extra = 2 * this.data.iqr * multiple;
    return [base - extra, base + extra];
  };

  Twokeys.prototype.Series.prototype.outside = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.outside : void 0) == null) {
      this.iqr();
      if ((ref1 = this.data) != null) {
        ref1.outside = this._getOutside();
      }
    }
    return this.data.outside;
  };

  Twokeys.prototype.Series.prototype._getOutside = function() {
    var j, len, max, min, num, outer, results, sorted;
    results = [];
    sorted = this.data.sorted;
    outer = this.data.outer;
    min = Math.min.apply(this, outer);
    max = Math.max.apply(this, outer);
    for (j = 0, len = sorted.length; j < len; j++) {
      num = sorted[j];
      if (num > max || num < min) {
        results.push(num);
      }
    }
    return results;
  };

  Twokeys.prototype.Series.prototype.inside = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.inside : void 0) == null) {
      this.iqr();
      if ((ref1 = this.data) != null) {
        ref1.inside = this._getInside();
      }
    }
    return this.data.inside;
  };

  Twokeys.prototype.Series.prototype._getInside = function() {
    var fences, j, len, max, min, num, results, sorted;
    results = [];
    sorted = this.data.sorted;
    fences = this.data.fences;
    min = Math.min.apply(this, fences);
    max = Math.max.apply(this, fences);
    for (j = 0, len = sorted.length; j < len; j++) {
      num = sorted[j];
      if (num < max && num > min) {
        results.push(num);
      }
    }
    return results;
  };

  Twokeys.prototype.Series.prototype.outliers = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.outliers : void 0) == null) {
      this.fences();
      if ((ref1 = this.data) != null) {
        ref1.outliers = this._getOutliers();
      }
    }
    return this.data.outliers;
  };

  Twokeys.prototype.Series.prototype._getOutliers = function(arr, hinged) {
    var fences, j, len, max, min, num, results, sorted;
    if (arr == null) {
      arr = [];
    }
    if (hinged == null) {
      hinged = [];
    }
    results = [];
    sorted = this.data.sorted;
    fences = this.data.fences;
    if (fences.length === 0) {
      return [];
    }
    min = Math.min(fences);
    max = Math.max(fences);
    for (j = 0, len = sorted.length; j < len; j++) {
      num = sorted[j];
      if (num > max || num < min) {
        results.push(num);
      }
    }
    return results;
  };

  Twokeys.prototype.Series.prototype.ranked = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.ranked : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.ranked = this._getRanked(this.data.sorted);
      }
    }
    return this.data.ranked;
  };

  Twokeys.prototype.Series.prototype._getRanked = function(arr, ties) {
    var _decr, _incr, down, i, isTie, j, k, len, len1, num, offset, ranked, reset, tiedCount, tiedNumbers, tiedRank, total, up, usable;
    if (arr == null) {
      arr = [];
    }
    if (ties == null) {
      ties = true;
    }
    up = {};
    down = {};
    total = arr.length;
    ranked = [];
    isTie = false;
    offset = 0;
    tiedRank = 0/0;
    tiedCount = 0;
    tiedNumbers = [];
    reset = function() {
      tiedRank = 0/0;
      tiedCount = 0;
      return tiedNumbers = [];
    };
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      num = arr[i];
      if (false === ties) {
        up[num] = i + 1;
        down[num] = total - i;
      } else {
        _incr = i + 1;
        _decr = i - 1;
        if (num === arr[_decr]) {
          isTie = true;
          tiedCount += 1;
          if (!isNaN(tiedRank) && false === isTie) {
            tiedNumbers.push(num);
            ranked.push(tiedNumbers);
            reset();
          } else {
            tiedNumbers.push(num);
            isTie = true;
            tiedRank = _decr;
          }
          if (num !== arr[_incr]) {
            ranked.push(tiedNumbers);
            reset();
          }
        } else {
          if (num !== arr[_incr]) {
            if (tiedNumbers.length > 0) {
              ranked.push(tiedNumbers);
              reset();
            } else {
              ranked.push(num);
            }
          } else {
            tiedNumbers.push(num);
          }
        }
      }
    }
    for (i = k = 0, len1 = ranked.length; k < len1; i = ++k) {
      num = ranked[i];
      if ('number' === typeof num) {
        down[num] = {
          rank: i + 1 + offset,
          peers: 0
        };
        up[num] = {
          rank: total - i - offset,
          peers: 0
        };
      }
      if ('object' === typeof num) {
        offset += num.length;
        usable = num[0];
        down[usable] = {
          rank: i + 1 + offset,
          peers: num.length
        };
        up[usable] = {
          rank: total - i - offset,
          peers: num.length
        };
      } else {
        offset += 1;
      }
    }
    return {
      up: up,
      down: down,
      groups: {
        down: ranked.slice(0),
        up: ranked.reverse()
      }
    };
  };

  Twokeys.prototype.Series.prototype.adjacent = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.adjacent : void 0) == null) {
      this.fences();
      if ((ref1 = this.data) != null) {
        ref1.adjacent = this._getAdjacent(this.data.sorted, this.data.fences);
      }
    }
    return this.data.adjacent;
  };

  Twokeys.prototype.Series.prototype._getAdjacent = function(arr, fences) {
    var high, highs, j, len, low, lows, val;
    if (arr == null) {
      arr = [];
    }
    if (fences == null) {
      fences = [];
    }
    if (fences.length === 0) {
      return [];
    }
    low = fences[0];
    lows = [];
    high = fences[1];
    highs = [];
    for (j = 0, len = arr.length; j < len; j++) {
      val = arr[j];
      if (val > low) {
        lows.push(val);
      }
      if (val < high) {
        highs.push(val);
      }
    }
    lows.sort();
    highs.sort();
    return [lows[0], highs[highs.length - 1]];
  };

  Twokeys.prototype.Series.prototype.binned = function(bins) {
    var ref, ref1;
    if (bins == null) {
      bins = 0/0;
    }
    if (((ref = this.data) != null ? ref.binned : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.binned = this._getBinned(this.data.sorted, this.data.fences, bins);
      }
    }
    return this.data.binned;
  };

  Twokeys.prototype.Series.prototype._getBinned = function(arr, bins, width, includeZero) {
    var areIntegers, bin, binned, extremes, item, j, k, len, len1, total, val;
    if (arr == null) {
      arr = [];
    }
    if (bins == null) {
      bins = 10;
    }
    if (width == null) {
      width = 0/0;
    }
    if (includeZero == null) {
      includeZero = true;
    }
    binned = {};
    total = arr.length;
    if (false === includeZero) {
      includeZero = 1;
    } else {
      includeZero = 0;
    }
    if (0 === total) {
      return {
        bins: 0,
        width: 0/0,
        binned: []
      };
    }
    extremes = this.data.extremes;
    if (!!extremes && !width && extremes.length === 2) {
      width = (extremes[1] - extremes[0]) / (Math.log(arr.length) / Math.LN2);
      width = Math.floor(width);
      areIntegers = true;
      for (j = 0, len = arr.length; j < len; j++) {
        item = arr[j];
        if (false === (0 === item % 1)) {
          areIntegers = false;
          break;
        }
      }
      if (areIntegers) {
        width = Math.floor(width);
      }
    }
    bins = Math.floor(extremes[1] / width) + 1;
    if (!bins || bins < 1) {
      bins = 1;
    }
    for (k = 0, len1 = arr.length; k < len1; k++) {
      val = arr[k];
      bin = Math.floor((val + -includeZero) / width);
      binned[bin] = binned[bin] || {};
      if ('undefined' === typeof binned[bin].count) {
        binned[bin].from = (bin * width) + includeZero;
        binned[bin].to = ((bin + 1) * width) + includeZero - 1;
      }
      if ('undefined' === typeof binned[bin].data) {
        binned[bin].data = [val];
      } else {
        binned[bin].data.push(val);
      }
    }
    return {
      bins: bins,
      width: width,
      binned: binned
    };
  };

  Twokeys.prototype.Series.prototype.logs = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.logs : void 0) == null) {
      if ((ref1 = this.data) != null) {
        ref1.logs = this._getLogs(this.data.original);
      }
    }
    return this.data.logs;
  };

  Twokeys.prototype.Series.prototype._getLogs = function(arr) {
    var j, len, results, val;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      val = arr[j];
      results.push(Math.log(val));
    }
    return results;
  };

  Twokeys.prototype.Series.prototype.roots = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.roots : void 0) == null) {
      if ((ref1 = this.data) != null) {
        ref1.roots = this._getRoots(this.data.original);
      }
    }
    return this.data.roots;
  };

  Twokeys.prototype.Series.prototype._getRoots = function(arr) {
    var j, len, results, val;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      val = arr[j];
      results.push(Math.sqrt(val));
    }
    return results;
  };

  Twokeys.prototype.Series.prototype.inverse = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.inverse : void 0) == null) {
      if ((ref1 = this.data) != null) {
        ref1.inverse = this._getInverse(this.data.original);
      }
    }
    return this.data.inverse;
  };

  Twokeys.prototype.Series.prototype._getInverse = function(arr) {
    var j, len, results, val;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (j = 0, len = arr.length; j < len; j++) {
      val = arr[j];
      results.push(1 / val);
    }
    return results;
  };

  Twokeys.prototype.Series.prototype.hanning = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.hanning : void 0) == null) {
      if ((ref1 = this.data) != null) {
        ref1.hanning = this._getSkipMeans(this.data.original);
      }
    }
    return this.data.hanning;
  };

  Twokeys.prototype.Series.prototype._getSkipMeans = function(arr) {
    var i, j, len, results, val;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (i = j = 0, len = arr.length; j < len; i = ++j) {
      val = arr[i];
      if (!(0 === i || ((arr.length - 1) === i))) {
        results.push((arr[i] + arr[i + 1]) / 2);
      }
    }
    results.unshift(arr[0]);
    results.push(arr[arr.length - 1]);
    return results;
  };

  Twokeys.prototype.Series.prototype.inside = function() {
    var ref, ref1;
    if (((ref = this.data) != null ? ref.inside : void 0) == null) {
      this.iqr();
      if ((ref1 = this.data) != null) {
        ref1.inside = this._getInside();
      }
    }
    return this.data.inside;
  };

  Twokeys.prototype.Series.prototype._jitter = function(arr, passes, floor, multiplier, weight, current) {
    var j, jittered, len, num, value;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = 1;
    }
    if (floor == null) {
      floor = 0/0;
    }
    if (multiplier == null) {
      multiplier = Twokeys.prototype.DEFAULT_JITTER_MULTIPLIER;
    }
    if (weight == null) {
      weight = 0/0;
    }
    if (current == null) {
      current = 0;
    }
    current = current + 1;
    arr = arr.slice(0);
    if (current <= passes) {
      jittered = [];
      for (j = 0, len = arr.length; j < len; j++) {
        num = arr[j];
        if (!weight && !isNaN(weight)) {
          weight = (1 + Math.floor(num / 10)) * (Math.random() > .5 ? 1 : -1);
        }
        value = Math.random() * multiplier * (1 + Math.floor(num / 10));
        value = num + Math.floor(Math.random() * multiplier * weight);
        if (!isNaN(floor && value < floor)) {
          value = floor;
        }
        jittered.push(value);
      }
      return this._jitter(jittered, passes, floor, multiplier, weight, current);
    }
    return arr;
  };

  Twokeys.prototype.Series.prototype.smooth = function() {
    var jittered, ref, ref1;
    jittered = this._jitter(this.data.sorted, 3);
    if (((ref = this.data) != null ? ref.smoothed : void 0) == null) {
      this.sorted();
      if ((ref1 = this.data) != null) {
        ref1.smooth = this._getSmooth(this.data.original);
      }
    }
    this.data.rough = this._getRough(this.data.original, this.data.smooth);
    return this.data.smooth;
  };

  Twokeys.prototype.Series.prototype._getRough = function(original, smoothed) {
    var j, ref, residuals, x;
    residuals = [];
    for (x = j = 0, ref = original.length - 1; 0 <= ref ? j <= ref : j >= ref; x = 0 <= ref ? ++j : --j) {
      residuals.push(original[x] - smoothed[x]);
    }
    return residuals;
  };

  Twokeys.prototype.Series.prototype._getSmooth = function(arr, passes) {
    var smoothed;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = 3;
    }
    smoothed = null;
    arr = arr.slice(0);
    smoothed = this._smoothMedian(arr, passes);
    smoothed = this._smoothExtremes(arr, -1);
    smoothed = this._smoothSplit(arr, 2);
    smoothed = this._smoothMedian(arr, passes);
    smoothed = this._smoothExtremes(arr, -1);
    smoothed = this._smoothMedian(arr, passes);
    return smoothed;
  };

  Twokeys.prototype.Series.prototype._smoothExtremes = function(arr, passes, current, end) {
    var antepenultimate, before, first, last, median, penultimate, second, third, tmp;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = 1;
    }
    if (current == null) {
      current = 0;
    }
    if (end == null) {
      end = 'both';
    }
    current = current + 1;
    arr = arr.slice(0);
    before = arr.slice(0);
    if (arr.length > 2 && ((current < (passes + 1)) || -1 === passes)) {
      if ('both' === end || 'head' === end) {
        first = before[0];
        second = before[1];
        third = before[2];
        tmp = second - (2 * (third - second));
        median = [second, tmp, first].sort();
        median = median[Math.floor(median.length / 2)];
        arr[0] = median;
      }
      if ('both' === end || 'tail' === end) {
        antepenultimate = before[arr.length - 3];
        penultimate = before[arr.length - 2];
        last = before[arr.length - 1];
        tmp = penultimate - (2 * (antepenultimate - penultimate));
        median = [penultimate, tmp, last].sort();
        median = median[Math.floor(median.length / 2)];
        arr[arr.length - 1] = median;
      }
    }
    return arr;
  };

  Twokeys.prototype.Series.prototype._smoothSplit = function(arr, passes, current) {
    var before, f1, i, j, len, num, splits, t1, t2;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = Twokeys.prototype.DEFAULT_SPLIT_PASSES;
    }
    if (current == null) {
      current = 0;
    }
    current = current + 1;
    arr = arr.slice(0);
    before = arr.slice(0);
    splits = [];
    if ((current <= passes) || -1 === passes) {
      t1 = null;
      t2 = null;
      f1 = null;
      for (i = j = 0, len = before.length; j < len; i = ++j) {
        num = before[i];
        t1 = before[i - 1];
        t2 = before[i - 2];
        f1 = before[i + 1];
        if (num === t1 && ((t1 > t2 && num > f1) || (t1 < t2 && num < f1))) {
          splits.push(i);
          arr = Array.prototype.concat(this._smoothExtremes(arr.slice(0, i)), this._smoothExtremes(arr.slice(i)));
        }
      }
      if (-1 === passes && (before.join('') === arr.join(''))) {
        return arr;
      }
      return this._smoothSplit(arr, passes, current);
    }
    return arr;
  };

  Twokeys.prototype.Series.prototype._smoothMedian = function(arr, passes, current) {
    var i, j, len, num, smoothed, total;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = 1;
    }
    if (current == null) {
      current = 0;
    }
    current = current + 1;
    arr = arr.slice(0);
    if ((current < passes) || -1 === passes) {
      total = arr.length;
      smoothed = [];
      for (i = j = 0, len = arr.length; j < len; i = ++j) {
        num = arr[i];
        if (i !== 0 && i !== (total - 1)) {
          smoothed.push(Math.min(Math.max(arr[i - 1], num), arr[i + 1]));
        }
      }
      smoothed = Array.prototype.concat(arr[0], smoothed, arr[total - 1]);
      if (-1 === passes && arr.join('') === smoothed.join('')) {
        return arr;
      }
      return this._smoothMedian(smoothed, passes, current);
    }
    return arr;
  };

  Twokeys.prototype.Series.prototype.describe = function() {
    if (this.data == null) {
      this.data = {};
    }
    this.data.description = {
      original: this.data.original,
      summary: {
        median: this.median(),
        mean: this.mean(),
        mode: this.mode(),
        hinges: this.hinges(),
        adjacent: this.adjacent(),
        outliers: this.outliers(),
        outer: this.outer(),
        outside: this.outside(),
        inside: this.inside(),
        extremes: this.extremes(),
        iqr: this.iqr(),
        fences: this.fences()
      },
      smooths: {
        smooth: this.smooth(),
        hanning: this.hanning()
      },
      transforms: {
        logs: this.logs(),
        roots: this.roots(),
        inverse: this.inverse()
      },
      counts: this.counts(),
      sorted: this.sorted(),
      ranked: this.ranked(),
      binned: this.binned()
    };
    return this.data.description;
  };

  Twokeys.prototype.Points = function(options) {
    var base1;
    if (options == null) {
      options = {};
    }
    if (this.data == null) {
      this.data = {};
    }
    if ('number' === typeof options) {
      this.count = options;
      options = {};
    } else {
      this.dimension = options.dimensionality || 2;
      this.count = options.count || 100;
    }
    this.data.original = options.data;
    if ((base1 = this.data).original == null) {
      base1.original = Twokeys.prototype._randomPoints.apply(this, [this.count, this.dimension]);
    }
    return this;
  };

  Twokeys.prototype.Points.prototype.describe = function() {
    if (this.data == null) {
      this.data = {};
    }
    this.data.description = {
      original: this.data.original
    };
    return this.data.description;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Twokeys;
  } else {
    window.Twokeys = Twokeys;
  }

}).call(this);
