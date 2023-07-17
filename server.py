from flask import Flask, request
import data_analysis

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    # Extract the health data file path and medication details from the request
    file_path = request.json['file_path']
    medication_input = request.json['medication_input']
    
    # Run the analysis script
    df = data_analysis.load_health_data(file_path)
    medication_details = data_analysis.load_medication_details(medication_input)
    medication_info = data_analysis.fetch_medication_info(medication_details)
    health_metrics = data_analysis.identify_health_metrics(medication_info)
    trends = data_analysis.perform_correlation_analysis(df, medication_details, health_metrics)
    data_object = data_analysis.generate_data_object(trends)
    
    # Return the data object
    return data_object
    # Clean the health data
    df = clean_health_data(df)

    # Explore the data
    explore_data(df)

    # Build a predictive model for a certain type of health data
    health_metric = 'HKQuantityTypeIdentifierStepCount'  # Specify the health metric to predict
    model, score = build_predictive_model(df, health_metric)

    # Predict future values
    num_days = 7  # Specify the number of days to predict
    future_value = predict_future_values(model, num_days)

    # Include the predictive analytics in the data object
    data['predictive_analytics'] = {
        'health_metric': health_metric,
        'score': score,
        'future_value': future_value.tolist()
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5000)  # Run the server on port 5000
