const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email} = req.body;
    console.log(req.body)
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (inventoryType === "in" && user.role !== "donar") {
    //   throw new Error("Not a donar account");
    // }
    // if (inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }
    //save record
   
    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    }else{
      req.body.donar = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Reocrd Added",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Errro In Create Inventory API",
      error,
    });
  }
};

// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Get All Inventory",
      error,
    });
  }
};

// GET Hospital BLOOD RECORS
const getInventorHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get all hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Consumer Getting All Inventory",
      error,
    });
  }
};

//get blood records of 3
const getRecentInventoryController = async(req,res)=> {
  try {

    const inventory = await inventoryModel.find({
      organisation:req.body.userId
    }).limit(3).sort({createdAt:-1})
    return res.status(200).send({
      success:true,
      message:'recent inventory data',
      inventory
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'error in recent inventory api',
      error,
    })
  }
}

//get donar records
const getDonarsController = async(req, res) => {
   try {

    const organisation = req.body.userId
    //find donars
    const donarId = await inventoryModel.distinct('donar', {
      organisation,
    });
   // console.log(donarId)

   const donars = await userModel.find({_id:{$in:donarId}})
   return res.status(200).send({
    success:true,
    message:'Donar record fetched sucessfully',
    donars,
   })
    
   } catch (error) {
    console.log(error)
    return res.status(500).send({
      success:false,
      message:'Error in Donar records',
      error
    })
   }
}

//const getHospital controllers 
const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //GET HOSPITAL ID
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    //FIND HOSPITAL
    const hospitals = await userModel.find({
      role: "hospital"
});
    console.log("----------------------------------------")
    console.log(hospitals)
    return res.status(200).send({
      success: true,
      message: "Hospitals Data Fetched Successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In get Hospital API",
      error,
    });
  }
};

//get org profile
const getOrganisationController = async(req, res) => {
    try {
      
      const donar = req.body.userId
      const orgId = await inventoryModel.distinct('organisation', {donar})
      //find org
      const organisations = await userModel.find({
        _id:{$in:orgId}
      })
      
      return res.status(200).send({
        success:true,
        message:'Org Data fetched Successfully',
        organisations,
       
      })
    


    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success:false,
        message:'error in org',
        error,
      })
    }
}
//get org for hospita;
const getOrganisationForHospitalController = async(req, res) => {
  try {
    
    const hospital = req.body.userId
    const orgId = await inventoryModel.distinct('organisation', {hospital})
    //find org
    const organisations = await userModel.find({
      _id:{$in:orgId}
    })
    
    return res.status(200).send({
      success:true,
      message:'Hospital Org Data fetched Successfully',
      organisations,
     
    })
  
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success:false,
      message:'error in hospita; org',
      error,
    })
  }
}

module.exports = { createInventoryController, getInventoryController, getDonarsController,
  getHospitalController,
  getOrganisationController,
  getOrganisationForHospitalController,
  getInventorHospitalController,
  getRecentInventoryController
 };