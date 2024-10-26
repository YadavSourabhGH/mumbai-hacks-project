async function sendOtp(event) {
    event.preventDefault(); // Prevent the default form submission
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
  
    // Prepare the data to be sent to the API
    const data = {
      email: email,
      subject: 'Your OTP Code',
      message: `Hello ${name}, your message: "${message}". Here is your OTP: ${generateOtp()}` // Generate OTP
    };
  
    try {
      const response = await fetch('https://email-api-for-application.onrender.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (result.success) {
        alert('OTP sent to your email. Please check your inbox.');
        document.getElementById('contact-form').style.display = 'none';
        document.getElementById('otp-section').style.display = 'block';
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  }
  
  // Function to generate a random OTP (for demonstration purposes)
  function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
  }
  
  async function verifyOtp() {
    const enteredOtp = document.getElementById('otp').value;
  
    // In a real application, you would compare this OTP with the one sent to the email
    // Here we simply alert for demonstration
    alert(`You entered: ${enteredOtp}`);
    // Implement your OTP verification logic here
  }
  