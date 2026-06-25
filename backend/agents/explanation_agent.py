kimport os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def generate_repayment_confidence_brief(graph_data: dict) -> str:
    api_key = os.getenv("FEATHERLESS_API_KEY")
    if not api_key:
        return "Repayment Confidence Brief unavailable: FEATHERLESS_API_KEY is not set."

    base_url = os.getenv("FEATHERLESS_API_BASE_URL", "https://api.featherless.ai/v1")
    client = OpenAI(
        base_url=base_url,
        api_key=api_key,
    )
    
    prompt = f"""
    You are an expert Credit Risk Analyst for KREDO, a relationship-based credit risk tool for agricultural SACCOs in Kenya.
    Based on the following JSON graph facts about a farmer and their network, write a 3-sentence plain-language "Repayment Confidence Brief".
    
    Graph Data:
    {json.dumps(graph_data)}
    
    Output ONLY the 3-sentence brief.
    """
    
    try:
        model_name = os.getenv("FEATHERLESS_MODEL_NAME", "meta-llama/Meta-Llama-3-8B-Instruct")
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating brief: {str(e)}"
