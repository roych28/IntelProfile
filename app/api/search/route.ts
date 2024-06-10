export async function POST(req: Request) {
  try {
    const { query, type } = await req.json();

    const response = await fetch('https://eye-6adaad69fa3d.profileintel.com/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '0b58a68e242e44e4afab4d8ce10133d8', // replace with your actual API key
      },
      body: JSON.stringify({ query, type }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Type assertion for the error object
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');
    const type = url.searchParams.get('type');

    const response = await fetch('https://eye-6adaad69fa3d.profileintel.com/api', {
      method: 'POST', // Assuming the external API only supports POST requests
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '0b58a68e242e44e4afab4d8ce10133d8', // replace with your actual API key
      },
      body: JSON.stringify({ query, type }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Type assertion for the error object
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
