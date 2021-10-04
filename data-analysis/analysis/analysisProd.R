source("data-analysis/analysis/analysis.R")


main(
    js_sort_file = "data/table/js-native/js-experiment-results-sort-native.csv",
    js_render_file = "data/table/js-native/js-experiment-results-render-native.csv",
    wasm_sort_file = "data/table/wasm-native/wasm-experiment-results-sort-native.csv",
    wasm_render_file = "data/table/wasm-native/wasm-experiment-results-render-native.csv",
    output_dir = "native-table"
)

# main(
#     js_sort_file = "data/table/js-native-lowercase/js-experiment-results-sort-native-to_lowercase.csv",
#     js_render_file = "data/table/js-native-lowercase/js-experiment-results-render-native-to_lowercase.csv",
#     wasm_sort_file = "data/table/wasm-native-lowercase/wasm-experiment-results-sort-native-to_lowercase.csv",
#     wasm_render_file = "data/table/wasm-native-lowercase/wasm-experiment-results-render-native-to_lowercase.csv",
#     output_dir = "native-table-lowercase"
# )



# main(
#     js_sort_file = "data/table/js-quick-sort/js-experiment-results-sort-quick-sort.csv",
#     js_render_file = "data/table/js-quick-sort/js-experiment-results-render-quick-sort.csv",
#     wasm_sort_file = "data/table/wasm-quick-sort/wasm-experiment-results-sort-quick-sort.csv",
#     wasm_render_file = "data/table/wasm-quick-sort/wasm-experiment-results-render-quick-sort.csv",
#     output_dir = "quick-sort-table"
# )

# main(
#     js_sort_file = "data/slick/js-native/js-experiment-results-sort-native-slick.csv",
#     js_render_file = "data/slick/js-native/js-experiment-results-render-native-slick.csv",
#     wasm_sort_file = "data/slick/wasm-native/wasm-experiment-results-sort-native-slick.csv",
#     wasm_render_file = "data/slick/wasm-native/wasm-experiment-results-render-native-slick.csv",
#     output_dir = "native-slick"
# )


# main(
#     js_sort_file = "data/slick/js-quick-sort/js-experiment-results-sort-quick-sort-slick.csv",
#     js_render_file = "data/slick/js-quick-sort/js-experiment-results-render-quick-sort-slick.csv",
#     wasm_sort_file = "data/slick/wasm-quick-sort/wasm-experiment-results-sort-quick-sort-slick.csv",
#     wasm_render_file = "data/slick/wasm-quick-sort/wasm-experiment-results-render-quick-sort-slick.csv",
#     output_dir = "quick-sort-slick"
# )
