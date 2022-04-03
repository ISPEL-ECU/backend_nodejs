const math_mod = require("mathjs");

function getRandomInteger(min, max, exception_value) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const random_value = Math.floor(Math.random() * (max - min)) + min;
  if (exception_value === null) {
    return random_value;
  } else if (exception_value.includes(random_value)) {
    return getRandomInteger(min, max, exception_value);
  } else {
    return random_value;
  }
}

exports.generate_uniform_distribution_question = () => {
  if (Math.random() < 0.3) {
    return this.generate_mean_question();
  } else if (Math.random() < 0.65) {
    return this.generate_variance_question();
  } else {
    return this.generate_cdf_question();
  }
};

exports.generate_mean_question = () => {
  // create a mathjs instance with configuration
  const config = {
    epsilon: 1e-12,
    matrix: "Matrix",
    number: "number",
    precision: 64,
    predictable: false,
    randomSeed: null,
  };
  const math = math_mod.create(math_mod.all, config);

  min_value = getRandomInteger(0, 9, null);
  max_value = getRandomInteger(min_value + 1, 10, null);

  const formula = math.parse("(max-min)/a");

  let scope = {
    min: min_value,
    max: max_value,
    a: 2,
  };
  let results = {};
  const correct_answer = formula.evaluate(scope);
  results["correctAnswer"] = correct_answer;
  const correct_a = 2;
  scope.a = getRandomInteger(1, 10, [correct_a]);
  const distractor1 = formula.evaluate(scope);
  const distr1_a = scope.a;
  results["distractor1"] = distractor1;
  scope.a = getRandomInteger(1, 10, [distr1_a, 2]);
  const distractor2 = formula.evaluate(scope);
  const distr2_a = scope.a;
  results["distractor2"] = distractor2;
  scope.a = getRandomInteger(1, 10, [distr1_a, distr2_a, 2]);
  const distractor3 = formula.evaluate(scope);
  results["distractor3"] = distractor3;

  results["text"] =
    "Find the mean, $\\mu$, for the uniform probability distribution given by X ~U(" +
    min_value +
    " , " +
    max_value +
    ")?";
  return results;
};

exports.generate_variance_question = () => {
  // create a mathjs instance with configuration
  const config = {
    epsilon: 1e-12,
    matrix: "Matrix",
    number: "number",
    precision: 64,
    predictable: false,
    randomSeed: null,
  };
  const math = math_mod.create(math_mod.all, config);

  min_value = getRandomInteger(0, 9, null);
  max_value = getRandomInteger(min_value + 1, 10, null);

  const formula = math.parse("((max-min)^a)/b");

  let scope = {
    min: min_value,
    max: max_value,
    a: 2,
    b: 12,
  };
  let results = {};
  const correct_answer = formula.evaluate(scope);
  results["correctAnswer"] = correct_answer;
  const correct_a = 2;
  const correct_b = 12;
  scope.a = getRandomInteger(1, 5, [correct_a]);
  scope.b = getRandomInteger(1, 100, [correct_b]);
  const distractor1 = formula.evaluate(scope);
  const distr1_a = scope.a;
  const distr1_b = scope.b;
  results["distractor1"] = distractor1;
  scope.a = getRandomInteger(1, 10, [distr1_a, 2]);
  scope.b = getRandomInteger(1, 100, [distr1_b, 12]);
  const distractor2 = formula.evaluate(scope);
  const distr2_a = scope.a;
  const distr2_b = scope.b;
  results["distractor2"] = distractor2;
  scope.a = getRandomInteger(1, 10, [distr1_a, distr2_a, 2]);
  scope.b = getRandomInteger(1, 100, [distr1_b, distr2_b, 12]);
  const distractor3 = formula.evaluate(scope);
  results["distractor3"] = distractor3;

  results["text"] =
    "Compute the variance for the continuous uniform distribution given by X ~U(" +
    min_value +
    " , " +
    max_value +
    ")?";
  return results;
};

exports.generate_cdf_question = () => {
  // create a mathjs instance with configuration
  const config = {
    epsilon: 1e-12,
    matrix: "Matrix",
    number: "number",
    precision: 64,
    predictable: false,
    randomSeed: null,
  };
  const math = math_mod.create(math_mod.all, config);

  min_value = getRandomInteger(0, 10, null);
  max_value = getRandomInteger(11, 20, null);

  const formula = math.parse("((max-min)^a)/b");

  let results = {};
  let correct_answer;
  let distractor1;
  let distractor2;
  let distractor3;
  let a;
  let b;

  switch (getRandomInteger(1, 3, null)) {
    case 1:
      correct_answer = "0";
      results["correctAnswer"] = correct_answer;
      distractor1 = String(getRandomInteger(min_value, max_value, [0]));
      results["distractor1"] = distractor1;

      distractor2 = String(
        getRandomInteger(min_value, max_value, [0, distractor1])
      );

      results["distractor2"] = distractor2;

      distractor3 = String(
        getRandomInteger(min_value, max_value, [0, distractor1, distractor2])
      );
      results["distractor3"] = distractor3;

      results["text"] =
        "The continuous random variable X is uniformly distributed on the interval [" +
        min_value +
        "," +
        max_value +
        "]. Find P(X=x)";
      return results;
    case 2:
      a = getRandomInteger(min_value, max_value - 1, [min_value]);
      b = getRandomInteger(a, max_value, [max_value]);
      correct_answer =
        "$\\frac{x-" + min_value + "}{" + (max_value - min_value) + "}$";
      results["correctAnswer"] = correct_answer;
      let distr1_a = getRandomInteger(min_value, max_value - 1, [min_value]);
      let distr1_b = getRandomInteger(distr1_a, max_value, [max_value]);
      distractor1 =
        "$\\frac{x-" + distr1_a + "}{" + (distr1_b - distr1_a) + "}$";
      results["distractor1"] = distractor1;

      distr2_a = getRandomInteger(min_value, max_value - 1, [
        distr1_a,
        min_value,
      ]);
      distr2_b = getRandomInteger(distr2_a, max_value, [distr1_b, max_value]);
      distractor2 =
        "$\\frac{x-" + distr2_a + "}{" + (distr2_b - distr2_a) + "}$";

      results["distractor2"] = distractor2;

      distr3_a = getRandomInteger(min_value, max_value - 1, [
        distr1_a,
        distr2_a,
        min_value,
      ]);
      distr3_b = getRandomInteger(distr3_a, max_value, [
        distr1_b,
        distr2_b,
        max_value,
      ]);
      distractor3 =
        "$\\frac{x-" + distr3_a + "}{" + (distr3_b - distr3_a) + "}$";

      results["distractor3"] = distractor3;

      results["text"] =
        "The continuous random variable X is uniformly distributed on the interval [" +
        min_value +
        "," +
        max_value +
        "]. Find P(X$\\leq$x)";
      return results;
    case 3:
      a = getRandomInteger(min_value, max_value - 1, [min_value]);
      b = getRandomInteger(a, max_value, [max_value]);
      correct_answer =
        "$\\frac{" + min_value + "-x}{" + (max_value - min_value) + "}$";
      results["correctAnswer"] = correct_answer;
      dist1_a = getRandomInteger(min_value, max_value - 1, [min_value]);
      dist1_b = getRandomInteger(distr1_a, max_value, [max_value]);
      distractor1 =
        "$\\frac{" + distr1_a + "-x}{" + (dist1_b - distr1_b) + "}$";
      results["distractor1"] = distractor1;

      dist2_a = getRandomInteger(min_value, max_value - 1, [
        distr1_a,
        min_value,
      ]);
      dist2_b = getRandomInteger(distr2_a, max_value, [distr1_b, max_value]);
      distractor2 =
        "$\\frac{" + distr2_a + "-a}{" + (dist2_b - distr2_b) + "}$";

      results["distractor2"] = distractor2;

      dist3_a = getRandomInteger(min_value, max_value - 1, [
        distr1_a,
        distr2_a,
        min_value,
      ]);
      dist3_b = getRandomInteger(dist3_a, max_value, [
        distr1_b,
        distr2_b,
        max_value,
      ]);
      distractor3 =
        "$\\frac{" + distr3_a + "-x}{" + (dist3_b - distr3_b) + "}$";

      results["distractor3"] = distractor3;

      results["text"] =
        "The continuous random variable X is uniformly distributed on the interval [" +
        min_value +
        "," +
        max_value +
        "]. Find P(X$\\leq$x)";
      return results;
    // case 4:
    //   a = getRandomInteger(min_value, max_value - 1, [min_value]);
    //   b = getRandomInteger(a, max_value, [max_value]);
    //   correct_answer =
    //     "$$\\frac{" + min_value + "-x}{" + (max_value - min_value) + "}";
    //   results["correctAnswer"] = correct_answer;
    //   dist1_a = getRandomInteger(min_value, max_value - 1, [min_value]);
    //   dist1_b = getRandomInteger(distr1_a, max_value, [max_value]);
    //   distractor1 =
    //     "$$\\frac{" + distr1_a + "-x}{" + (dist1_b - distr1_b) + "}";
    //   results["distractor1"] = distractor1;

    //   dist2_a = getRandomInteger(min_value, max_value - 1, [
    //     distr1_a,
    //     min_value,
    //   ]);
    //   dist2_b = getRandomInteger(distr2_a, max_value, [distr1_b, max_value]);
    //   distractor2 =
    //     "$$\\frac{" + distr2_a + "-a}{" + (dist2_b - distr2_b) + "}";

    //   results["distractor2"] = distractor2;

    //   dist3_a = getRandomInteger(min_value, max_value - 1, [
    //     distr1_a,
    //     distr2_a,
    //     min_value,
    //   ]);
    //   dist3_b = getRandomInteger(dist3_a, max_value, [
    //     distr1_b,
    //     distr2_b,
    //     max_value,
    //   ]);
    //   distractor3 =
    //     "$$\\frac{" + distr3_a + "-x}{" + (dist3_b - distr3_b) + "}";

    //   results["distractor3"] = distractor3;

    //   results["text"] =
    //     "The continuous random variable X is uniformly distributed on the interval [" +
    //     min_value +
    //     "," +
    //     max_value +
    //     "]. Find P(X$\\leq$x)";
    //   return results;
  }
};
