import { GetEmployeesOptions } from "../../lib/types/employee-query";
import { EmployeeProfile } from "../../models/employee-profile.model";
import axios from "axios";

// Reusable geocode function
async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json', limit: 1 }
    });

    if (Array.isArray(data) && data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lon), parseFloat(lat)];
    }

    return null;
  } catch (err) {
    console.error("Geocoding failed:", err);
    return null;
  }
}

export const getAllEmployeeForCustomer = async (queryData: GetEmployeesOptions) => {
  const {
    search = '',
    minHourRate,
    maxHourRate,
    minRating,
    address,
    radius = 20,
    page = 1,
    limit = 1,
    jobCategory
  } = queryData;

  const validatedLimit = Math.min(limit, 1);
  try {
    // Pagination setup
    const validatedPage = Math.max(page, 1);
    const skip = (validatedPage - 1) * validatedLimit;

    // Get coordinates if address is provided
    const coordinates = address ? await geocodeAddress(address) : null;

    let employees = [];
    let totalEmployees = 0;

    // Build base match conditions
    const buildMatchConditions = () => {
      const matchConditions: any = {};

      // Text search
      if (search.trim()) {
        matchConditions.$text = { $search: search.trim() };
      }

      if(jobCategory){
        matchConditions.jobCategory =  jobCategory
      }

      // Hourly rate filtering
      if (minHourRate !== undefined && minHourRate > 0) {
        matchConditions.hourlyRate = { ...matchConditions.hourlyRate, $gte: minHourRate };
      }
      if (maxHourRate !== undefined && maxHourRate < 10000) {
        matchConditions.hourlyRate = { ...matchConditions.hourlyRate, $lte: maxHourRate };
      }

      // Rating filter
      if (minRating !== undefined && minRating > 0) {
        matchConditions.rating = { $gte: minRating };
      }

      return matchConditions;
    };

    if (coordinates) {
      // Try geo aggregation first
      try {
        const matchConditions = buildMatchConditions();
        const aggregationPipeline: any[] = [];

        // GeoNear stage
        aggregationPipeline.push({
          $geoNear: {
            near: { type: "Point", coordinates },
            distanceField: "distance",
            maxDistance: radius * 1000,
            spherical: true
          }
        });

        // Add match stage if we have conditions
        if (Object.keys(matchConditions).length > 0) {
          aggregationPipeline.push({ $match: matchConditions });
        }

        // Get count first (without pagination)
        const countPipeline = [...aggregationPipeline, { $count: "total" }];
        
        // Add pagination to main pipeline
        aggregationPipeline.push(
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: validatedLimit }
        );

        console.log("Trying geo aggregation pipeline:", JSON.stringify(aggregationPipeline, null, 2));

        // Execute both pipelines
        const [employeeResults, countResults] = await Promise.all([
          EmployeeProfile.aggregate(aggregationPipeline).exec(),
          EmployeeProfile.aggregate(countPipeline).exec()
        ]);

        employees = employeeResults;
        totalEmployees = countResults[0]?.total || 0;

        // Check if geo query worked properly
        if (totalEmployees === 0 && employees.length === 0) {
          console.warn("Geo aggregation returned no results, trying regular query as fallback");
          throw new Error("Geo query failed, falling back to regular query");
        }

        // If we got employees but count is 0, fix the count
        if (totalEmployees === 0 && employees.length > 0) {
          console.warn("Got employees but count is 0, recalculating...");
          totalEmployees = employees.length; // Use approximate count for now
        }

        console.log("Geo query successful:", { totalEmployees, employeesReturned: employees.length });

      } catch (geoError) {
        console.warn("Geo aggregation failed, falling back to regular query:");
        
        // Fallback to regular query without geo filtering
        const matchConditions = buildMatchConditions();
        
        const [employeeResults, countResult] = await Promise.all([
          EmployeeProfile.find(matchConditions)
            .skip(skip)
            .limit(validatedLimit)
            .sort({ createdAt: -1 })
            .lean()
            .exec(),
          EmployeeProfile.countDocuments(matchConditions).exec()
        ]);

        employees = employeeResults;
        totalEmployees = countResult;
        
        console.log("Fallback query used:", { totalEmployees, employeesReturned: employees.length });
      }

    } else {
      const matchConditions = buildMatchConditions();

      console.log("Using regular query:", JSON.stringify(matchConditions, null, 2));

      const [employeeResults, countResult] = await Promise.all([
        EmployeeProfile.find(matchConditions)
          .skip(skip)
          .limit(validatedLimit)
          .sort({ createdAt: -1 })
          .lean()
          .exec(),
        EmployeeProfile.countDocuments(matchConditions).exec()
      ]);

      employees = employeeResults;
      totalEmployees = countResult;
    }

    console.log("Final results:", { 
      totalEmployees, 
      employeesReturned: employees.length,
      hasCoordinates: !!coordinates,
      page: validatedPage,
      limit: validatedLimit
    });

    const totalPages = Math.ceil(totalEmployees / validatedLimit);

    return {
      success: true,
      employees: employees.map((e: any) => ({
        ...e,
        createdAt: e.createdAt?.toISOString?.() ?? e.createdAt,
        updatedAt: e.updatedAt?.toISOString?.() ?? e.updatedAt,
      })),
      totalEmployees,
      totalPages,
      currentPage: validatedPage,
      hasNextPage: validatedPage < totalPages,
      hasPrevPage: validatedPage > 1,
      limit: validatedLimit
    };

  } catch (error) {
    console.error("Employee fetch failed:", error);
    return {
      success: false,
      error: "Failed to fetch employees",
      employees: [],
      totalEmployees: 0,
      totalPages: 0,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false,
      limit: validatedLimit
    };
  }
};