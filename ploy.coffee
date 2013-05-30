window.Ploy = () ->
  @

Ploy::DEFAULT_MAX_RANDOM_INTEGER = 1000
Ploy::DEFAULT_RANDOM_SERIES_COUNT = 100
Ploy::DEFAULT_OUTLIER_MULTIPLE = 1.5
Ploy::DEFAULT_JITTER_MULTIPLIER = 1
Ploy::DEFAULT_SPLIT_PASSES = 2

# Gives a random number between 1 and `max`
Ploy::_randomInteger = (max = Ploy::DEFAULT_MAX_RANDOM_INTEGER) -> Math.floor( Math.random() * ( Math.random() * max ) )

# Gives a random series of `count` length with max `max`
Ploy::_randomSeries = (count = Ploy::DEFAULT_RANDOM_SERIES_COUNT, max = Ploy::DEFAULT_MAX_RANDOM_INTEGER, series = [] ) ->
  series.push( Ploy::_randomInteger(max) ) for num in [1..count ]
  series

# Series
Ploy::Series = (options = {}) ->
  @data ?= {}
  @data.original = options.data
  @data.original ?= Ploy::_randomSeries.apply(@,[])
  @

# Utilities

# Sort

Ploy::Series::sort = () ->
  if !@data?.sorted?
    @data?.sorted = @_getSort( @data?.original )
  @data?.sorted

Ploy::Series::_getSort = (arr = []) ->
  arr = arr.slice(0)
  arr.sort (a,b) ->
    if a > b then 1
    else if a is b then 0
    else -1
  arr

# Values

# Median

Ploy::Series::median = () ->
  @sort()
  @data ?= {}
  if !@data.median?
    @data.median = @_getMedian(@data.sorted)
  if !@data.medianDepth?
    @data.medianDepth = @_getMedianDepth(@data.sorted)
  description =
    datum: @data.median
    depth: @data.medianDepth

Ploy::Series::mean = () ->
  if !@data?.mean?
    @data?.mean = @_getMean(@data?.original)
  @data.mean

Ploy::Series::_getMean = (arr = []) ->
  if !arr.length or 0 is arr.length
    return NaN
  console.log('arr',arr.length)
  total = 0
  i = 0
  total += num for num, i in arr
  total / i

Ploy::Series::mode = () ->
  if !@data?.mode?
    @sort()
    @data?.mode = @_getMode(@data.sorted)
  @data.mode

Ploy::Series::_getMode = (data = [], best = [] ) ->
  if !data.length or !best.length or 0 is data.length or 0 is best.length
    return []
  data = data.slice(0)
  best = best.slice(0)
  if 'undefined' is typeof best[0]
    best = [ [] ]
  if true isnt ( data.length > 0 )
    return best
  else
    last = null
    run = []
    idx = 0
    while data.length
      val = data.shift()
      if null is last
        run.push val
        last = val
      else if val isnt last
        if 'undefined' is typeof best[ 0 ] or run.length > best[ 0 ].length
          best = [ run ]
        else if run.length is best[ 0 ].length
          best.push run
        return @_getMode(data, best)
      else
        run.push val
  arr = []
  arr.push val[ 0 ] for val in best
  result =
    count: best[ 0 ].length
    data: arr
  result

Ploy::Series::extremes = () ->
  if !@data?.extremes?
    @sort()
    @data?.extremes = @_getExtremes(@data.sorted)
  @data.extremes

Ploy::Series::_getExtremes = (data = []) ->
  if !data.lemgth or 0 is data.lemgth then []
  else
    [ data[ 0 ], data[ data.length - 1 ] ]

Ploy::Series::counts = () ->
  if !@data?.counts?
    @sort()
    @data?.counts = @_getCounts(@data.sorted)
  @data.counts

Ploy::Series::_getCounts = (data = [], counts = [] ) ->
  data = data.slice(0)
  counts = counts.slice(0)
  while data.length
    val = data.shift()
    found = false
    for count, idx in counts
      if val is count[ 0 ]
        counts[ idx ][ 1 ]++
        found = true
    if false is found
      counts.push [ val, 1 ]
    return @_getCounts(data, counts)
  counts

Ploy::Series::_getMedianDepth = (arr = [], offset = 0 ) ->
  if !arr.length or 0 is arr.length
    NaN
  else
    offset + ((arr.length + 1)/2)

Ploy::Series::_getMedian = (arr = []) ->
  arr = arr.slice(0)
  if !arr.length or 0 is arr.length
    return NaN
  result = null
  switch arr.length
    when 0 then result = 0
    when 2 then result = ( arr[ 0 ] + arr[ 1 ] ) / 2
    when 1 then result = arr[ 0 ]
    else
      arr.shift()
      arr.pop()
      result = Ploy::Series::_getMedian(arr)
  result

Ploy::Series::hinges = () ->
  if !@data?.hinges?
    @sort()
    @data?.hinges = @_getHinges(@data.sorted)
  @data.hinges

Ploy::Series::_getHinges = (arr = [], hinges = 2, result = []) ->
  arr = arr.slice(0)
  total = arr.length
  if 0 isnt hinges % 2
    hinges++
  if true isnt ( total > hinges )
    return result
  if true isnt ( hinges > 0 )
    return result
  per = Math.floor( total / hinges )
  how_many = ( total / per ) - 1
  for step in [0..how_many]
    fragment = arr.slice(step*per, ((step*per) + per))
    result.push
      datum: @_getMedian(fragment)
      depth: @_getMedianDepth(fragment, ((step*per)))
  result

Ploy::Series::iqr = () ->
  if !@data?.iqr?
    @hinges()
    @data?.iqr = @_getIQR(@data.hinges)
  @data?.iqr

Ploy::Series::_getIQR = (hinges = []) ->
  first = hinges[0]?.datum
  second = hinges[1]?.datum
  if !first? or !second?
    NaN
  else
    Math.abs(first - second)


Ploy::Series::fences = () ->
  if !@data?.fences?
    @iqr()
    @data?.fences = @_getFences()
  @data.fences

Ploy::Series::_getFences = (multiple = Ploy::DEFAULT_OUTLIER_MULTIPLE) ->
  base = @data.median
  extra = @data.iqr * multiple
  if !base or !extra
    []
  else
    [ base - extra, base + extra ]

Ploy::Series::outer = () ->
  if !@data?.outer?
    @iqr()
    @data?.outer = @_getOuter()
  @data.outer

Ploy::Series::_getOuter = (multiple = Ploy::DEFAULT_OUTLIER_MULTIPLE) ->
  base = @data.median
  if !base
    return []
  extra = 2 * @data.iqr * multiple
  [ base - extra, base + extra ]

Ploy::Series::outside = () ->
  if !@data?.outside?
    @iqr()
    @data?.outside = @_getOutside()
  @data.outside

Ploy::Series::_getOutside = () ->
  results = []
  sorted = @data.sorted
  outer = @data.outer
  min = Math.min.apply(@, outer)
  max = Math.max.apply(@, outer)
  for num in sorted
    if num > max or num < min
      results.push(num)
  results
Ploy::Series::inside = () ->
  if !@data?.inside?
    @iqr()
    @data?.inside = @_getInside()
  @data.inside

Ploy::Series::_getInside = () ->
  results = []
  sorted = @data.sorted
  fences = @data.fences
  min = Math.min.apply(@, fences)
  max = Math.max.apply(@, fences)
  for num in sorted
    if num < max and num > min
      results.push(num)
  results

Ploy::Series::outliers = () ->
  if !@data?.outliers?
    @fences()
    @data?.outliers = @_getOutliers()
  @data.outliers

Ploy::Series::_getOutliers = (arr = [], hinged = []) ->
  results = []
  sorted = @data.sorted
  fences = @data.fences
  min = Math.min.apply(@, fences)
  max = Math.max.apply(@, fences)
  for num in sorted
    if num > max or num < min
      results.push(num)
  results

Ploy::Series::logs = () ->
  if !@data?.logs?
    @data?.logs = @_getLogs( @data.original )
  @data.logs

Ploy::Series::_getLogs = (arr = []) ->
  results = []
  results.push( Math.log( val ) ) for val in arr
  results

Ploy::Series::roots = () ->
  if !@data?.roots?
    @data?.roots = @_getRoots( @data.original )
  @data.roots

Ploy::Series::_getRoots = (arr = []) ->
  results = []
  results.push( Math.sqrt( val ) ) for val in arr
  results

Ploy::Series::inverse = () ->
  if !@data?.inverse?
    @data?.inverse = @_getInverse( @data.original )
  @data.inverse

Ploy::Series::_getInverse = (arr = []) ->
  results = []
  results.push( 1 / val ) for val in arr
  results

Ploy::Series::skipMeans = () ->
  if !@data?.skipMeans?
    @data?.skipMeans = @_getSkipMeans( @data.original )
  @data.skipMeans

Ploy::Series::_getSkipMeans = (arr = []) ->
  results = []
  for val, i in arr
    unless 0 is i or ( ( arr.length - 1 ) is i )
      results.push( ( arr[ i ] + arr[ i + 1 ] ) / 2 )
  results.unshift(arr[0])
  results.push(arr[arr.length - 1 ])
  results

Ploy::Series::inside = () ->
  if !@data?.inside?
    @iqr()
    @data?.inside = @_getInside()
  @data.inside

Ploy::Series::_jitter = (arr = [], passes = 1, floor = NaN, multiplier = Ploy::DEFAULT_JITTER_MULTIPLIER, current = 0 ) ->
  current = current + 1
  arr = arr.slice(0)
  if ( current <= passes )
    jittered = []
    for num in arr
      value = Math.random() * multiplier * ( 1 + Math.floor(num/10) )
      value = ( num + Math.floor( Math.random() * multiplier * ( 1 + Math.floor(num/10) ) * ( if Math.random() > .5 then 1 else -1 ) ) )
      if !isNaN floor and value < floor then value = floor
      jittered.push value
    return @_jitter(jittered, passes, floor, multiplier, current)
  arr

Ploy::Series::smooth = () ->
  jittered = @_jitter( @data.sorted, 3 )
  if !@data?.smoothed?
    @sort()
    @data?.smooth = @_getSmooth( @data.original )
  #console.log('SORTED',@data.sorted)
  #console.log('JITTERED',jittered)
  @data.rough = @_getRough( @data.original, @data.smooth )
  @data.smooth

Ploy::Series::_getRough = (original, smoothed) ->
  residuals = []
  residuals.push( original[ x ] - smoothed[ x ] ) for x in [0..original.length - 1]
  console.log('residuals',original.length, smoothed.length)
  return residuals

Ploy::Series::_getSmooth = (arr = [], passes = 3) ->
  smoothed = null
  arr = arr.slice(0)
  smoothed = @_smoothMedian(arr, passes)
  smoothed = @_smoothExtremes(arr, -1)
  smoothed = @_smoothSplit(arr, 2)
  smoothed = @_smoothMedian(arr, passes)
  smoothed = @_smoothExtremes(arr, -1)
  smoothed = @_smoothMedian(arr, passes)
  smoothed

Ploy::Series::_smoothExtremes = (arr = [], passes = 1, current = 0, end = 'both' ) ->
  current = current + 1
  arr = arr.slice(0)
  before = arr.slice(0)
  if arr.length > 2 and ( ( current < ( passes + 1 ) ) or -1 is passes )
    if 'both' is end or 'head' is end
      first = before[ 0 ]
      second = before[ 1 ]
      third = before[ 2 ]
      tmp = second - ( 2 * ( third - second ) )
      median = [ second, tmp, first ].sort()
      median = median[ Math.floor( median.length / 2 ) ]
      arr[ 0 ] = median
    if 'both' is end or 'tail' is end
      antepenultimate = before[ arr.length - 3 ]
      penultimate = before[ arr.length - 2 ]
      last = before[ arr.length - 1 ]
      tmp = penultimate - ( 2 * ( antepenultimate - penultimate ) )
      median = [ penultimate, tmp, last ].sort();
      median = median[ Math.floor( median.length / 2 ) ]
      arr[ arr.length - 1 ] = median
  arr


Ploy::Series::_smoothSplit = (arr = [], passes = Ploy::DEFAULT_SPLIT_PASSES, current = 0 ) ->
  current = current + 1
  arr = arr.slice(0)
  before = arr.slice(0)
  splits = []
  if ( current <= passes ) or -1 is passes
    console.log('split',current)
    t1 = null
    t2 = null
    f1 = null
    for num, i in before
      t1 = before[ i - 1 ]
      t2 = before[ i - 2 ]
      f1 = before[ i + 1 ]
      if num is t1 and ( ( t1 > t2 and num > f1 ) or ( t1 < t2 and num < f1 ) )
        splits.push i
        arr = Array::concat( @_smoothExtremes(arr.slice(0, i)), @_smoothExtremes(arr.slice(i)) )
    if -1 is passes and ( before.join('') is arr.join('') )
      return arr
    return @_smoothSplit(arr, passes, current)
  arr

Ploy::Series::_smoothMedian = (arr = [], passes = 1, current = 0 ) ->
  current = current + 1
  arr = arr.slice(0)
  if ( current < passes ) or -1 is passes
    total = arr.length
    smoothed = []
    for num, i in arr
      if i isnt 0 and i isnt ( total - 1 )
        smoothed.push Math.min( Math.max( arr[ i - 1 ], num ), arr[ i + 1 ] )
    smoothed = Array::concat(arr[ 0 ], smoothed, arr[ total - 1 ])
    if -1 is passes and arr.join('') is smoothed.join('') then return arr
    return @_smoothMedian(smoothed, passes, current)
  arr

Ploy::Series::describe = () ->
  @data ?= {}
  @data.description =
    original: @data.original
    median: @median()
    mean: @mean()
    mode: @mode()
    counts: @counts()
    hinges: @hinges()
    iqr: @iqr()
    fences: @fences()
    outliers: @outliers()
    outer: @outer()
    outside: @outside()
    inside: @inside()
    extremes: @extremes()
    smooth: @smooth()
    skipMeans: @skipMeans()
    transforms:
      logs: @logs()
      roots: @roots()
      inverse: @inverse()

  @data.description
