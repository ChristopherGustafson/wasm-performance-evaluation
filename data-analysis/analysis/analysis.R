# Imports
library(data.table)
library(matrixStats)
# Read data files
js_data <- read.csv(file = "data-generation/javascript-data.csv")

# Expected execution time function for sorting user list of n users
time_sort_func <- function(n, k1, c1) {
  n * log2(n) * k1 + c1
}
# Expected execution time function for rendering user list of n users
time_render_func <- function(n, k2, c2) {
   n * k2 + c2
}

# Generate graph and fit expected equation for the specified sorting data
create_sort_graphs <- function(js_data, wasm_data, output_file) {
  # Define output file
  jpeg(file = stringr::str_interp("out/sort-plot.jpeg"))


  # Plot js sorting data
  x <- js_data[, 1]
  y <- js_data[, 2]
  plot(x, y,
    xlab = "User list size", ylab = "Execution time (ms)"
  )
  fit <- nls(y ~ time_sort_func(x, k1, c1), start = list(k1 = 1, c1 = 0))
  print(summary(fit))


  # Plot wasm sorting data
  x <- wasm_data[, 1]
  y <- wasm_data[, 2]
  points(x, y, pch = 16);
  fit <- nls(y ~ time_sort_func(x, k1, c1), start = list(k1 = 1, c1 = 0))

  legend(
    x = "topleft",
    legend = c(
      "JavaScript",
      "WebAssembly"
    ),
    pch = c(1, 16)
  )

  dev.off()
  print(summary(fit))
}

# Generate graph and fit expected equation for the specified rendering data
create_render_graphs <- function(js_data, wasm_data, output_file) {
  jpeg(file = stringr::str_interp("out/render-plot.jpeg"))

  # Plot js render data
  x <- js_data[, 1]
  y <- js_data[, 2]
  plot(x, y,
    xlab = "User list size", ylab = "Execution time (ms)"
  )
  # Fit js render data to expected equation
  fit <- nls(y ~ time_render_func(x, k2, c2), start = list(k2 = 1, c2 = 0))
  print(summary(fit))

  x <- wasm_data[, 1]
  y <- wasm_data[, 2]
  points(x, y, pch = 16);
  fit <- nls(y ~ time_render_func(x, k2, c2), start = list(k2 = 1, c2 = 0))

  legend(
    x = "topleft",
    legend = c(
      "JavaScript",
      "WebAssembly"
    ),
    pch = c(1, 16)
  )
  dev.off()
  print(summary(fit))
}

# Generate a speedup plot, using Y1/Y2
create_speedup_plot <- function(x, y1, y2) {
  y <- y1 / y2
  reg1 <- lm(y ~ x)
  jpeg(file = "out/speedup-plot.jpeg")
  plot(x, y,
    xlab = "User list size", ylab = "Speedup"
  )
  abline(reg1)
  print(reg1)
  dev.off()
}

# From a file input, generate parsed output
get_data <- function(file) {
  file_data <- read.csv(
    file = file
  )

  y_data <- as.matrix(file_data[, -1])
  x_data <- file_data[, 1]

  medians <- data.frame(
    ID = x_data,
    Medians = rowMedians(y_data)
  )

  return(list(
    "y" = y_data,
    "x" = x_data,
    "median" = medians
  ))
}


js_sort_data <- get_data(file = "data-generation/javascript-data-sort.csv")
wasm_sort_data <- get_data(file = "data-generation/webasm-data-sort.csv")

js_render_data <- get_data(file = "data-generation/javascript-data-render.csv")
wasm_render_data <- get_data(file = "data-generation/webasm-data-render.csv")


print("Analyzing sorting");
create_sort_graphs(
  js_data = js_sort_data$median,
  wasm_data = wasm_sort_data$median,
  output_file = "js"
)

print("Analyzing rendering");
create_render_graphs(
  js_data = js_render_data$median,
  wasm_data = wasm_render_data$median,
  output_file = "js"
)

create_speedup_plot(
  x = wasm_sort_data$median[, 1] + wasm_render_data$median[, 1],
  y1 = js_sort_data$median[, 2] + js_render_data$median[, 2],
  y2 = wasm_sort_data$median[, 2] + wasm_render_data$median[, 2]
)

confidence_interval <- function(data, file_name) {
  # Standard deviations
  sds <- matrixStats::rowSds(data$y)
  # Means of each row
  means <- rowMeans(data$y)
  # Number of columns (population size)
  columns <- length(data$y) / length(data$x)

  error <- qnorm(0.975) * sds / sqrt(columns)
  error_upper <- means + error
  error_lower <- means - error

  jpeg(file = stringr::str_interp("out/confidence-${file_name}-plot.jpeg"))

  plot(
    data$x,
    error_upper,
    col = "blue",
    type = "l",
    xlab = "User list size",
    ylab = "Execution time (ms)"
  )
  lines(
    data$x,
    error_lower,
    col = "red",
  )
  lines(data$x, means, col = "orange")
  legend(
    x = "topleft",
    legend = c(
      "Mean execution time",
      "Upper confidence value",
      "Lower confidence value"
    ),
    col = c("orange", "blue", "red"),
    lty = 1, cex = 1
  )
  dev.off()
}

# Commented out as they are not yet adapted to seperate sort and render times
# confidence_interval(wasm_data, file_name = "wasm")
# confidence_interval(js_data, file_name = "js")
