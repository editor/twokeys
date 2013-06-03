// Generated by CoffeeScript 1.4.0
(function() {

  window.Ploy = function() {
    return this;
  };

  Ploy.prototype.DEFAULT_MAX_RANDOM_INTEGER = 10000;

  Ploy.prototype.DEFAULT_RANDOM_SERIES_COUNT = 1000;

  Ploy.prototype.DEFAULT_OUTLIER_MULTIPLE = 1.5;

  Ploy.prototype.DEFAULT_JITTER_MULTIPLIER = 1;

  Ploy.prototype.DEFAULT_SPLIT_PASSES = 2;

  Ploy.prototype._randomInteger = function(max) {
    if (max == null) {
      max = Ploy.prototype.DEFAULT_MAX_RANDOM_INTEGER;
    }
    return Math.floor(Math.random() * max);
  };

  Ploy.prototype._randomSeries = function(count, max, series) {
    var num, _i;
    if (count == null) {
      count = Ploy.prototype.DEFAULT_RANDOM_SERIES_COUNT;
    }
    if (max == null) {
      max = Ploy.prototype.DEFAULT_MAX_RANDOM_INTEGER;
    }
    if (series == null) {
      series = [];
    }
    for (num = _i = 1; 1 <= count ? _i <= count : _i >= count; num = 1 <= count ? ++_i : --_i) {
      series.push(Ploy.prototype._randomInteger(max));
    }
    return series;
  };

  Ploy.prototype.Series = function(options) {
    var _base, _ref, _ref1;
    if (options == null) {
      options = {};
    }
    if ((_ref = this.data) == null) {
      this.data = {};
    }
    this.data.original = options.data;
    if ((_ref1 = (_base = this.data).original) == null) {
      _base.original = Ploy.prototype._randomSeries.apply(this, []);
    }
    return this;
  };

  Ploy.prototype.Series.prototype.sorted = function() {
    var _ref, _ref1, _ref2, _ref3;
    if (!(((_ref = this.data) != null ? _ref.sorted : void 0) != null)) {
      if ((_ref1 = this.data) != null) {
        _ref1.sorted = this._getSorted((_ref2 = this.data) != null ? _ref2.original : void 0);
      }
    }
    return (_ref3 = this.data) != null ? _ref3.sorted : void 0;
  };

  Ploy.prototype.Series.prototype._getSorted = function(arr) {
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

  Ploy.prototype.Series.prototype.median = function() {
    var description, _ref;
    this.sorted();
    if ((_ref = this.data) == null) {
      this.data = {};
    }
    if (!(this.data.median != null)) {
      this.data.median = this._getMedian(this.data.sorted);
    }
    if (!(this.data.medianDepth != null)) {
      this.data.medianDepth = this._getMedianDepth(this.data.sorted);
    }
    return description = {
      datum: this.data.median,
      depth: this.data.medianDepth
    };
  };

  Ploy.prototype.Series.prototype.mean = function() {
    var _ref, _ref1, _ref2;
    if (!(((_ref = this.data) != null ? _ref.mean : void 0) != null)) {
      if ((_ref1 = this.data) != null) {
        _ref1.mean = this._getMean((_ref2 = this.data) != null ? _ref2.original : void 0);
      }
    }
    return this.data.mean;
  };

  Ploy.prototype.Series.prototype._getMean = function(arr) {
    var i, num, total, _i, _len;
    if (arr == null) {
      arr = [];
    }
    if (!arr.length || 0 === arr.length) {
      return NaN;
    }
    console.log('arr', arr.length);
    total = 0;
    i = 0;
    for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
      num = arr[i];
      total += num;
    }
    return total / i;
  };

  Ploy.prototype.Series.prototype.mode = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.mode : void 0) != null)) {
      this.sorted();
      if ((_ref1 = this.data) != null) {
        _ref1.mode = this._getMode(this.data.sorted);
      }
    }
    return this.data.mode;
  };

  Ploy.prototype.Series.prototype._getMode = function(data, best) {
    var arr, idx, last, result, run, val, _i, _len;
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
    for (_i = 0, _len = best.length; _i < _len; _i++) {
      val = best[_i];
      arr.push(val[0]);
    }
    result = {
      count: best[0].length,
      data: arr
    };
    return result;
  };

  Ploy.prototype.Series.prototype.extremes = function() {
    var _ref, _ref1;
    console.log('EXTRE');
    if (!(((_ref = this.data) != null ? _ref.extremes : void 0) != null)) {
      this.sorted();
      if ((_ref1 = this.data) != null) {
        _ref1.extremes = this._getExtremes(this.data.sorted);
      }
    }
    return this.data.extremes;
  };

  Ploy.prototype.Series.prototype._getExtremes = function(data) {
    if (data == null) {
      data = [];
    }
    console.log('getting');
    if (!data.length || 0 === data.length) {
      return [];
    } else {
      return [data[0], data[data.length - 1]];
    }
  };

  Ploy.prototype.Series.prototype.counts = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.counts : void 0) != null)) {
      this.sorted();
      if ((_ref1 = this.data) != null) {
        _ref1.counts = this._getCounts(this.data.sorted);
      }
    }
    return this.data.counts;
  };

  Ploy.prototype.Series.prototype._getCounts = function(data, counts) {
    var count, found, idx, val, _i, _len;
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
      for (idx = _i = 0, _len = counts.length; _i < _len; idx = ++_i) {
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

  Ploy.prototype.Series.prototype._getMedianDepth = function(arr, offset) {
    if (arr == null) {
      arr = [];
    }
    if (offset == null) {
      offset = 0;
    }
    if (!arr.length || 0 === arr.length) {
      return NaN;
    } else {
      return offset + ((arr.length + 1) / 2);
    }
  };

  Ploy.prototype.Series.prototype._getMedian = function(arr) {
    var result;
    if (arr == null) {
      arr = [];
    }
    arr = arr.slice(0);
    if (!arr.length || 0 === arr.length) {
      return NaN;
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
        result = Ploy.prototype.Series.prototype._getMedian(arr);
    }
    return result;
  };

  Ploy.prototype.Series.prototype.hinges = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.hinges : void 0) != null)) {
      this.sorted();
      if ((_ref1 = this.data) != null) {
        _ref1.hinges = this._getHinges(this.data.sorted);
      }
    }
    return this.data.hinges;
  };

  Ploy.prototype.Series.prototype._getHinges = function(arr, hinges, result) {
    var fragment, how_many, per, step, total, _i;
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
    how_many = (total / per) - 1;
    for (step = _i = 0; 0 <= how_many ? _i <= how_many : _i >= how_many; step = 0 <= how_many ? ++_i : --_i) {
      fragment = arr.slice(step * per, (step * per) + per);
      result.push({
        datum: this._getMedian(fragment),
        depth: this._getMedianDepth(fragment, step * per)
      });
    }
    return result;
  };

  Ploy.prototype.Series.prototype.iqr = function() {
    var _ref, _ref1, _ref2;
    if (!(((_ref = this.data) != null ? _ref.iqr : void 0) != null)) {
      this.hinges();
      if ((_ref1 = this.data) != null) {
        _ref1.iqr = this._getIQR(this.data.hinges);
      }
    }
    return (_ref2 = this.data) != null ? _ref2.iqr : void 0;
  };

  Ploy.prototype.Series.prototype._getIQR = function(hinges) {
    var first, second, _ref, _ref1;
    if (hinges == null) {
      hinges = [];
    }
    first = (_ref = hinges[0]) != null ? _ref.datum : void 0;
    second = (_ref1 = hinges[1]) != null ? _ref1.datum : void 0;
    if (!(first != null) || !(second != null)) {
      return NaN;
    } else {
      return Math.abs(first - second);
    }
  };

  Ploy.prototype.Series.prototype.fences = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.fences : void 0) != null)) {
      this.iqr();
      if ((_ref1 = this.data) != null) {
        _ref1.fences = this._getFences();
      }
    }
    return this.data.fences;
  };

  Ploy.prototype.Series.prototype._getFences = function(multiple) {
    var base, extra;
    if (multiple == null) {
      multiple = Ploy.prototype.DEFAULT_OUTLIER_MULTIPLE;
    }
    base = this.data.median;
    extra = this.data.iqr * multiple;
    if (!base || !extra) {
      return [];
    } else {
      return [base - extra, base + extra];
    }
  };

  Ploy.prototype.Series.prototype.outer = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.outer : void 0) != null)) {
      this.iqr();
      if ((_ref1 = this.data) != null) {
        _ref1.outer = this._getOuter();
      }
    }
    return this.data.outer;
  };

  Ploy.prototype.Series.prototype._getOuter = function(multiple) {
    var base, extra;
    if (multiple == null) {
      multiple = Ploy.prototype.DEFAULT_OUTLIER_MULTIPLE;
    }
    base = this.data.median;
    if (!base) {
      return [];
    }
    extra = 2 * this.data.iqr * multiple;
    return [base - extra, base + extra];
  };

  Ploy.prototype.Series.prototype.outside = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.outside : void 0) != null)) {
      this.iqr();
      if ((_ref1 = this.data) != null) {
        _ref1.outside = this._getOutside();
      }
    }
    return this.data.outside;
  };

  Ploy.prototype.Series.prototype._getOutside = function() {
    var max, min, num, outer, results, sorted, _i, _len;
    results = [];
    sorted = this.data.sorted;
    outer = this.data.outer;
    min = Math.min.apply(this, outer);
    max = Math.max.apply(this, outer);
    for (_i = 0, _len = sorted.length; _i < _len; _i++) {
      num = sorted[_i];
      if (num > max || num < min) {
        results.push(num);
      }
    }
    return results;
  };

  Ploy.prototype.Series.prototype.inside = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.inside : void 0) != null)) {
      this.iqr();
      if ((_ref1 = this.data) != null) {
        _ref1.inside = this._getInside();
      }
    }
    return this.data.inside;
  };

  Ploy.prototype.Series.prototype._getInside = function() {
    var fences, max, min, num, results, sorted, _i, _len;
    results = [];
    sorted = this.data.sorted;
    fences = this.data.fences;
    min = Math.min.apply(this, fences);
    max = Math.max.apply(this, fences);
    for (_i = 0, _len = sorted.length; _i < _len; _i++) {
      num = sorted[_i];
      if (num < max && num > min) {
        results.push(num);
      }
    }
    return results;
  };

  Ploy.prototype.Series.prototype.outliers = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.outliers : void 0) != null)) {
      this.fences();
      if ((_ref1 = this.data) != null) {
        _ref1.outliers = this._getOutliers();
      }
    }
    return this.data.outliers;
  };

  Ploy.prototype.Series.prototype._getOutliers = function(arr, hinged) {
    var fences, max, min, num, results, sorted, _i, _len;
    if (arr == null) {
      arr = [];
    }
    if (hinged == null) {
      hinged = [];
    }
    results = [];
    sorted = this.data.sorted;
    fences = this.data.fences;
    min = Math.min.apply(this, fences);
    max = Math.max.apply(this, fences);
    for (_i = 0, _len = sorted.length; _i < _len; _i++) {
      num = sorted[_i];
      if (num > max || num < min) {
        results.push(num);
      }
    }
    return results;
  };

  Ploy.prototype.Series.prototype.ranked = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.ranked : void 0) != null)) {
      this.sorted();
      if ((_ref1 = this.data) != null) {
        _ref1.ranked = this._getRanked(this.data.sorted);
      }
    }
    return this.data.ranked;
  };

  Ploy.prototype.Series.prototype._getRanked = function(arr, ties) {
    var down, i, isTie, num, offset, ranked, reset, tiedCount, tiedNumbers, tiedRank, total, up, usable, _decr, _i, _incr, _j, _len, _len1;
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
    tiedRank = NaN;
    tiedCount = 0;
    tiedNumbers = [];
    reset = function() {
      tiedRank = NaN;
      tiedCount = 0;
      return tiedNumbers = [];
    };
    for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
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
          if (NaN !== tiedRank && false === isTie) {
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
    for (i = _j = 0, _len1 = ranked.length; _j < _len1; i = ++_j) {
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

  Ploy.prototype.Series.prototype.adjacent = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.adjacent : void 0) != null)) {
      this.fences();
      if ((_ref1 = this.data) != null) {
        _ref1.adjacent = this._getAdjacent(this.data.sorted, this.data.fences);
      }
    }
    return this.data.adjacent;
  };

  Ploy.prototype.Series.prototype._getAdjacent = function(arr, fences) {
    var high, highs, low, lows, val, _i, _len;
    if (arr == null) {
      arr = [];
    }
    if (fences == null) {
      fences = {};
    }
    low = fences[0];
    lows = [];
    high = fences[1];
    highs = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      val = arr[_i];
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

  Ploy.prototype.Series.prototype.binned = function(bins) {
    var _ref, _ref1;
    if (bins == null) {
      bins = NaN;
    }
    if (!(((_ref = this.data) != null ? _ref.binned : void 0) != null)) {
      this.sorted();
      this.mode;
      if ((_ref1 = this.data) != null) {
        _ref1.binned = this._getBinned(this.data.sorted, this.data.fences, bins);
      }
    }
    return this.data.binned;
  };

  Ploy.prototype.Series.prototype._getBinned = function(arr, bins, width, includeZero) {
    var areIntegers, bin, binned, extremes, item, total, val, _i, _j, _len, _len1;
    if (arr == null) {
      arr = [];
    }
    if (bins == null) {
      bins = 10;
    }
    if (width == null) {
      width = NaN;
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
        width: NaN,
        binned: []
      };
    }
    extremes = this.data.extremes;
    if (!width && extremes.length === 2) {
      width = (extremes[1] - extremes[0]) / (Math.log(arr.length) / Math.LN2);
      width = Math.floor(width);
      areIntegers = true;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
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
    for (_j = 0, _len1 = arr.length; _j < _len1; _j++) {
      val = arr[_j];
      bin = Math.floor((val + -includeZero) / width);
      binned[bin] = binned[bin] || {};
      if ('undefined' === typeof binned[bin].count) {
        binned[bin].count = 1;
        binned[bin].from = (bin * width) + includeZero;
        binned[bin].to = ((bin + 1) * width) + includeZero - 1;
      } else {
        binned[bin].count += 1;
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

  Ploy.prototype.Series.prototype.logs = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.logs : void 0) != null)) {
      if ((_ref1 = this.data) != null) {
        _ref1.logs = this._getLogs(this.data.original);
      }
    }
    return this.data.logs;
  };

  Ploy.prototype.Series.prototype._getLogs = function(arr) {
    var results, val, _i, _len;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      val = arr[_i];
      results.push(Math.log(val));
    }
    return results;
  };

  Ploy.prototype.Series.prototype.roots = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.roots : void 0) != null)) {
      if ((_ref1 = this.data) != null) {
        _ref1.roots = this._getRoots(this.data.original);
      }
    }
    return this.data.roots;
  };

  Ploy.prototype.Series.prototype._getRoots = function(arr) {
    var results, val, _i, _len;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      val = arr[_i];
      results.push(Math.sqrt(val));
    }
    return results;
  };

  Ploy.prototype.Series.prototype.inverse = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.inverse : void 0) != null)) {
      if ((_ref1 = this.data) != null) {
        _ref1.inverse = this._getInverse(this.data.original);
      }
    }
    return this.data.inverse;
  };

  Ploy.prototype.Series.prototype._getInverse = function(arr) {
    var results, val, _i, _len;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      val = arr[_i];
      results.push(1 / val);
    }
    return results;
  };

  Ploy.prototype.Series.prototype.hanning = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.hanning : void 0) != null)) {
      if ((_ref1 = this.data) != null) {
        _ref1.hanning = this._getSkipMeans(this.data.original);
      }
    }
    return this.data.hanning;
  };

  Ploy.prototype.Series.prototype._getSkipMeans = function(arr) {
    var i, results, val, _i, _len;
    if (arr == null) {
      arr = [];
    }
    results = [];
    for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
      val = arr[i];
      if (!(0 === i || ((arr.length - 1) === i))) {
        results.push((arr[i] + arr[i + 1]) / 2);
      }
    }
    results.unshift(arr[0]);
    results.push(arr[arr.length - 1]);
    return results;
  };

  Ploy.prototype.Series.prototype.inside = function() {
    var _ref, _ref1;
    if (!(((_ref = this.data) != null ? _ref.inside : void 0) != null)) {
      this.iqr();
      if ((_ref1 = this.data) != null) {
        _ref1.inside = this._getInside();
      }
    }
    return this.data.inside;
  };

  Ploy.prototype.Series.prototype._jitter = function(arr, passes, floor, multiplier, weight, current) {
    var jittered, num, value, _i, _len;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = 1;
    }
    if (floor == null) {
      floor = NaN;
    }
    if (multiplier == null) {
      multiplier = Ploy.prototype.DEFAULT_JITTER_MULTIPLIER;
    }
    if (weight == null) {
      weight = NaN;
    }
    if (current == null) {
      current = 0;
    }
    current = current + 1;
    if (!weight) {
      weight = (1 + Math.floor(num / 10)) * (Math.random() > .5 ? 1 : -1);
    }
    arr = arr.slice(0);
    if (current <= passes) {
      jittered = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        num = arr[_i];
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

  Ploy.prototype.Series.prototype.smooth = function() {
    var jittered, _ref, _ref1;
    jittered = this._jitter(this.data.sorted, 3);
    if (!(((_ref = this.data) != null ? _ref.smoothed : void 0) != null)) {
      this.sorted();
      if ((_ref1 = this.data) != null) {
        _ref1.smooth = this._getSmooth(this.data.original);
      }
    }
    this.data.rough = this._getRough(this.data.original, this.data.smooth);
    return this.data.smooth;
  };

  Ploy.prototype.Series.prototype._getRough = function(original, smoothed) {
    var residuals, x, _i, _ref;
    residuals = [];
    for (x = _i = 0, _ref = original.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
      residuals.push(original[x] - smoothed[x]);
    }
    console.log('residuals', original.length, smoothed.length);
    return residuals;
  };

  Ploy.prototype.Series.prototype._getSmooth = function(arr, passes) {
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

  Ploy.prototype.Series.prototype._smoothExtremes = function(arr, passes, current, end) {
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

  Ploy.prototype.Series.prototype._smoothSplit = function(arr, passes, current) {
    var before, f1, i, num, splits, t1, t2, _i, _len;
    if (arr == null) {
      arr = [];
    }
    if (passes == null) {
      passes = Ploy.prototype.DEFAULT_SPLIT_PASSES;
    }
    if (current == null) {
      current = 0;
    }
    current = current + 1;
    arr = arr.slice(0);
    before = arr.slice(0);
    splits = [];
    if ((current <= passes) || -1 === passes) {
      console.log('split', current);
      t1 = null;
      t2 = null;
      f1 = null;
      for (i = _i = 0, _len = before.length; _i < _len; i = ++_i) {
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

  Ploy.prototype.Series.prototype._smoothMedian = function(arr, passes, current) {
    var i, num, smoothed, total, _i, _len;
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
      for (i = _i = 0, _len = arr.length; _i < _len; i = ++_i) {
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

  Ploy.prototype.Series.prototype.describe = function() {
    var _ref;
    if ((_ref = this.data) == null) {
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

}).call(this);
