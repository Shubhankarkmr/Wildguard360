// import express from 'express';
// import PetReport from '../model/petReport.js'; // Ensure the PetReport model is defined
// import nodemailer from 'nodemailer';
// const router = express.Router();




// // POST: Submit a new pet report
// router.post('/pets', async (req, res) => {
//   try {
//     const petReport = new PetReport(req.body);
//     await petReport.save();
//     res.status(200).json({ message: 'Pet report submitted successfully' });
//   } catch (error) {
//     console.error('Error processing pet report:', error);
//     res.status(500).json({ message: 'Failed to submit pet report' });
//   }
// });

// // GET: Fetch all pet reports
// router.get('/location', async (req, res) => {
//   try {
//     const petReports = await PetReport.find().select('coordinates name phone email petName petType petAge petImage description status');
//     res.json(petReports);
//   } catch (error) {
//     console.error('Error fetching pet reports:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // PUT: Update a pet report by ID
// router.put('/pets/:id', async (req, res) => {
//   try {
//     const updatedPetReport = await PetReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedPetReport) {
//       return res.status(404).json({ message: 'Pet report not found' });
//     }
//     res.status(200).json(updatedPetReport);
//   } catch (error) {
//     console.error('Error updating pet report:', error);
//     res.status(500).json({ message: 'Failed to update pet report' });
//   }
// });

// // DELETE: Remove a pet report by ID
// router.delete('/pets/:id', async (req, res) => {
//   try {
//     const deletedPetReport = await PetReport.findByIdAndDelete(req.params.id);
//     if (!deletedPetReport) {
//       return res.status(404).json({ message: 'Pet report not found' });
//     }
//     res.status(200).json({ message: 'Pet report deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting pet report:', error);
//     res.status(500).json({ message: 'Failed to delete pet report' });
//   }
// });
// router.post('/api/notify', async (req, res) => {
//   const { email, petName, distance } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: 'cse22093@iiitkalyani.ac.in',
//       pass: 'uxuhrbfghjukdxee', 
//     },
//   });

//   // Email content
//   let mailOptions = {
//     from: 'cse22093@iiitkalyani.ac.in',
//     to: email,
//     subject: 'Your Pet is Nearby!',
//     text: `We detected that your pet, ${petName}, is only ${distance} km away from the initial location. Please check nearby.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).send({ message: 'Notification sent successfully' });
//   } catch (error) {
//     res.status(500).send({ error: 'Error sending email' });
//   }
// });


// export default router;

import express from 'express';
import PetReport from '../model/petReport.js'; // Ensure the PetReport model is defined
import nodemailer from 'nodemailer';

const router = express.Router();

// POST: Submit a new pet report
router.post('/pets', async (req, res) => {
  try {
    const petReport = new PetReport(req.body);
    await petReport.save();
    res.status(200).json({ message: 'Pet report submitted successfully' });
  } catch (error) {
    console.error('Error processing pet report:', error);
    res.status(500).json({ message: 'Failed to submit pet report' });
  }
});

// GET: Fetch all pet reports
router.get('/location', async (req, res) => {
  try {
    const petReports = await PetReport.find().select('coordinates name phone email petName petType petAge petImage description status');
    res.json(petReports);
  } catch (error) {
    console.error('Error fetching pet reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update a pet report by ID
router.put('/pets/:id', async (req, res) => {
  try {
    const updatedPetReport = await PetReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPetReport) {
      return res.status(404).json({ message: 'Pet report not found' });
    }
    res.status(200).json(updatedPetReport);
  } catch (error) {
    console.error('Error updating pet report:', error);
    res.status(500).json({ message: 'Failed to update pet report' });
  }
});

// DELETE: Remove a pet report by ID
router.delete('/pets/:id', async (req, res) => {
  try {
    const deletedPetReport = await PetReport.findByIdAndDelete(req.params.id);
    if (!deletedPetReport) {
      return res.status(404).json({ message: 'Pet report not found' });
    }
    res.status(200).json({ message: 'Pet report deleted successfully' });
  } catch (error) {
    console.error('Error deleting pet report:', error);
    res.status(500).json({ message: 'Failed to delete pet report' });
  }
});

// POST: Send notification email if the pet is nearby
router.post('/notify', async (req, res) => {
  const { email, petName, distance } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'wildlifepetsfind@gmail.com',
      pass: 'geseupycbloingef', // Use environment variables or a secure method for storing passwords
    },
  });

  // Email content
  let mailOptions = {
    from: 'cse22093@iiitkalyani.ac.in',
    to: email,
    subject: 'Your Pet is Nearby!',
    text: `We detected that your pet, ${petName}, is only ${distance} km away from the initial location. Please check nearby.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ error: 'Error sending email' });
  }
});

export default router;
