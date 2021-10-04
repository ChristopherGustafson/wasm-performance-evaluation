from typing import Dict
import numpy as np
from numpy.lib.scimath import log10, power

import csv

# Array of user amount to try out
USER_AMOUNTS = np.arange(10, 1001, step=10)


def generate_sort_execution_times(
    overhead: int = 1,
    iterations: int = 10,
    user_amounts: np.ndarray = USER_AMOUNTS,
) -> Dict[int, np.ndarray]:
    """
    This generates data for each entry in the population size list for a desired amount of iterations.

    This function assumes an sorting function with worst case execution time of O(n^2), average time of O(nlog(n))
    and best case time of O(nlog(n))

    :param overhead: the overhead for the sort implementation
    :param iterations: the amount of iterations per population size
    :param users_amounts: the population of users that data should be generated for
    """

    result = {user_amount: None for user_amount in user_amounts}

    for user_amount in user_amounts:
        # Standard deviation
        sd = 1

        def map_execution_time(distribution_location: int):
            # Best and average case are O(nlog(n))
            # Worst case is O(n^2)
            # If the result are outside of 3 standard deviations on the positive side, use worst case
            if distribution_location > (3 * sd):
                exec_time = power(user_amount, 2)
            else:
                exec_time = user_amount * log10(user_amount)
            # Get a random positive value between a 90% of the execution time and the execution time
            return np.random.uniform(exec_time * 0.90, exec_time * 1.10) * overhead

        normal_distribution = np.random.normal(0.0, sd, iterations)
        user_amount_result = np.array(
            list(map(map_execution_time, normal_distribution))
        )
        result[user_amount] = user_amount_result

    return result


def generate_render_execution_times(
    overhead: int = 1, iterations: int = 10, user_amounts: np.ndarray = USER_AMOUNTS
):
    result = {user_amount: None for user_amount in user_amounts}

    for user_amount in user_amounts:

        def map_rendering_time(render_time):
            # To account for randomness in the rendering time, create a randomness constant
            randomness = np.random.uniform(-user_amount / 8, user_amount / 8)
            return render_time + randomness

        user_amount_result = np.array(
            list(map(map_rendering_time, np.full(iterations, user_amount * overhead)))
        )
        result[user_amount] = user_amount_result

    return result


def create_data_file(
    file_str: str,
    overhead_sort: int = 1,
    overhead_render: int = 1,
    iterations: int = 10,
    user_amounts: np.ndarray = USER_AMOUNTS,
):
    data_sort = generate_sort_execution_times(
        iterations=iterations, overhead=overhead_sort, user_amounts=user_amounts
    )

    data_render = generate_render_execution_times(
        iterations=iterations, overhead=overhead_render, user_amounts=user_amounts
    )

    with open(file_str + ".csv", "w") as file:
        writer = csv.writer(file)
        columns = list(map(lambda i: "Iteration {}".format(i + 1), range(iterations)))
        writer.writerow(["User amount"] + columns)
        for user_amount, result_sort in data_sort.items():
            result_render = data_render[user_amount]
            result = np.add(result_sort, result_render)
            writer.writerow(
                np.concatenate([np.array([user_amount], dtype=int), result])
            )

    with open(file_str + "-sort.csv", "w") as file:
        writer = csv.writer(file)
        columns = list(map(lambda i: "Iteration {}".format(i + 1), range(iterations)))
        writer.writerow(["User amount"] + columns)
        for user_amount, result in data_sort.items():
            writer.writerow(
                np.concatenate([np.array([user_amount], dtype=int), result])
            )

    with open(file_str + "-render.csv", "w") as file:
        writer = csv.writer(file)
        columns = list(map(lambda i: "Iteration {}".format(i + 1), range(iterations)))
        writer.writerow(["User amount"] + columns)
        for user_amount, result in data_render.items():
            writer.writerow(
                np.concatenate([np.array([user_amount], dtype=int), result])
            )


if __name__ == "__main__":
    create_data_file("javascript-data", overhead_render=1, overhead_sort=1.5)
    create_data_file("webasm-data", overhead_render=1.2, overhead_sort=1)
