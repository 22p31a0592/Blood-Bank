function toggleForm() {
      const form = document.getElementById('donorFormContainer');
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    async function submitDonorForm(event) {
      event.preventDefault();

      const formData = {
        name: document.getElementById("name").value,
        bloodGroup: document.getElementById("bloodGroup").value,
        location: document.getElementById("location").value,
        phonenumber: document.getElementById("phonenumber").value
      };

      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const result = await response.text();
        alert(`✅ ${result}\n❤️ Thank you for registering as a donor!`);
        document.getElementById("donorForm").reset();
      } catch (error) {
        alert("❌ Failed to register. Please try again.");
        console.error(error);
      }
    }


document.getElementById('SearchButton').addEventListener('click', async () => {
  const location = document.getElementById('LocationInput').value.trim();
  const bloodGroup = document.getElementById('BloodGroupSelection').value;

  if (!location) {
    alert('Please enter a location');
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/search?location=${encodeURIComponent(location)}&bloodGroup=${encodeURIComponent(bloodGroup)}`);
    const donors = await response.json();

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = ""; // Clear previous results

    if (donors.length === 0) {
      resultsDiv.innerHTML = "<p>No donors found for the selected criteria.</p>";
      return;
    }

    donors.forEach(donor => {
      const donorInfo = document.createElement('div');
      donorInfo.style.border = "1px solid #ccc";
      donorInfo.style.padding = "10px";
      donorInfo.style.margin = "10px 0";
      donorInfo.style.borderRadius = "5px";
      donorInfo.innerHTML = `
        <strong>Name:</strong> ${donor.name} <br>
        <strong>Blood Group:</strong> ${donor.bloodGroup} <br>
        <strong>Location:</strong> ${donor.location} <br>
        <strong>Phone:</strong> ${donor.phonenumber}
      `;
      resultsDiv.appendChild(donorInfo);
    });
  } catch (error) {
    alert('Failed to fetch donor data');
    console.error(error);
  }
});
