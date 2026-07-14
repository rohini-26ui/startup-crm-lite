import Lead from '../models/Lead.js';
import { paginatedResponse } from '../utils/apiResponse.js';

/**
 * Get all leads for the authenticated user with pagination, sorting, and filtering.
 * 
 * Inputs: Query parameters (status, search, page, limit, sortBy, sortOrder, source, dateFrom, dateTo)
 * Outputs: Paginated list of leads with total counts and page information
 * Side effects: None
 */
export const getLeads = async (req, res, next) => {
  try {
    const { 
      status, search, source, dateFrom, dateTo,
      page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' 
    } = req.query;

    const filter = { owner: req.user._id };

    if (status && status !== 'All') filter.status = status;
    if (source && source !== 'All') filter.source = source;

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const parsedLimit = parseInt(limit, 10);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(parsedLimit),
      Lead.countDocuments(filter)
    ]);

    // Construct pagination manually to include hasNext, hasPrev as requested
    const totalPages = Math.ceil(total / parsedLimit);
    const currentPage = parseInt(page, 10);

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: currentPage,
        limit: parsedLimit,
        pages: totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new lead for the authenticated user.
 * 
 * Inputs: req.body (name, company, email, phone, status, source, notes)
 * Outputs: HTTP 201 with the newly created lead object
 * Side effects: Creates a new document in the Leads collection
 */
export const createLead = async (req, res, next) => {
  try {
    // Destructure specifically to prevent injection of unauthorized fields like owner
    const { name, company, email, phone, status, source, notes } = req.body;

    // Create new Lead, binding it to the current user's ID
    const newLead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      notes,
      owner: req.user._id
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('Created new lead with ID:', newLead._id);
    }

    // Return 201 with the newly created lead
    res.status(201).json({
      success: true,
      data: newLead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific lead by ID, ensuring it belongs to the authenticated user.
 * 
 * Inputs: req.params.id
 * Outputs: Lead object if found, HTTP 404 otherwise
 * Side effects: None
 */
export const getLeadById = async (req, res, next) => {
  try {
    // Isolate by owner ID
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Fetched lead details for ID:', lead._id);
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a lead by ID. Cannot change the owner field.
 * 
 * Inputs: req.params.id, req.body with fields to update
 * Outputs: Updated lead object, or HTTP 404 if not found
 * Side effects: Modifies a document in the Leads collection
 */
export const updateLead = async (req, res, next) => {
  try {
    // Destructure to prevent malicious owner field injection
    const { name, company, email, phone, status, source, notes } = req.body;
    
    // Construct payload safely
    const updateData = { name, company, email, phone, status, source, notes };
    
    // Remove undefined values to avoid overwriting existing data with null/undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Find and update while maintaining owner isolation
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Updated lead with ID:', lead._id);
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update only the status of a lead by ID.
 * 
 * Inputs: req.params.id, req.body containing { status }
 * Outputs: Updated lead object
 * Side effects: Modifies the status field of a lead
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`Updated lead ${lead._id} status to ${status}`);
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a lead by ID securely based on ownership.
 * 
 * Inputs: req.params.id
 * Outputs: HTTP 200 with success message, or HTTP 404 if not found
 * Side effects: Removes a document from the Leads collection
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Invoke deleteOne on the document
    await lead.deleteOne();

    if (process.env.NODE_ENV === 'development') {
      console.log('Deleted lead with ID:', lead._id);
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get aggregate statistics for all leads belonging to the user.
 * 
 * Inputs: Authentication header resolving to req.user._id
 * Outputs: Stats object containing totalLeads, statusBreakdown, conversionRate, sourceBreakdown, thisMonthLeads, lastMonthLeads, growthRate
 * Side effects: None
 */
export const getLeadStats = async (req, res, next) => {
  try {
    const now = new Date();
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const stats = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      { 
        $facet: {
          basicStats: [
            {
              $group: {
                _id: null,
                totalLeads: { $sum: 1 },
                wonCount: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } }
              }
            }
          ],
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          sourceBreakdown: [
            { $group: { _id: '$source', count: { $sum: 1 } } }
          ],
          thisMonthLeads: [
            { $match: { createdAt: { $gte: firstOfThisMonth } } },
            { $count: 'count' }
          ],
          lastMonthLeads: [
            { $match: { createdAt: { $gte: firstOfLastMonth, $lte: endOfLastMonth } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = stats[0];
    const totalLeads = result.basicStats[0]?.totalLeads || 0;
    const wonCount = result.basicStats[0]?.wonCount || 0;
    
    // Formatting breakdown arrays into objects
    const statusBreakdown = result.statusBreakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const sourceBreakdown = result.sourceBreakdown.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const thisMonth = result.thisMonthLeads[0]?.count || 0;
    const lastMonth = result.lastMonthLeads[0]?.count || 0;

    let conversionRate = 0;
    if (totalLeads > 0) {
      conversionRate = Number(((wonCount / totalLeads) * 100).toFixed(1));
    }

    let growthRate = null;
    if (lastMonth > 0) {
      growthRate = Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1));
    } else if (thisMonth > 0) {
      growthRate = 100; // 100% growth if there were 0 last month but > 0 this month
    }

    const formattedStats = {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads: thisMonth,
      lastMonthLeads: lastMonth,
      growthRate
    };

    res.status(200).json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly statistics for the last 6 months (Analytics data).
 * 
 * Inputs: Authentication header resolving to req.user._id
 * Outputs: Array of monthly stats containing month, total, won, lost, conversionRate
 * Side effects: None
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await Lead.aggregate([
      { 
        $match: { 
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Build exactly the last 6 months zero-filled array
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyStats = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      
      // Find matching aggregation result
      const stat = monthlyStats.find(s => s._id.year === year && s._id.month === month);
      
      const total = stat?.total || 0;
      const won = stat?.won || 0;
      const lost = stat?.lost || 0;
      const conversionRate = total > 0 ? Number(((won / total) * 100).toFixed(1)) : 0;
      
      formattedMonthlyStats.push({
        month: `${monthNames[month - 1]} ${year}`,
        total,
        won,
        lost,
        conversionRate
      });
    }

    res.status(200).json({
      success: true,
      data: formattedMonthlyStats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Search leads for quick autocomplete.
 * 
 * Inputs: q (search query), limit
 * Outputs: Minimal list of matching leads
 * Side effects: None
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }

    const filter = {
      owner: req.user._id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    };

    const parsedLimit = parseInt(limit, 10);
    const maxLimit = parsedLimit > 0 && parsedLimit <= 20 ? parsedLimit : 5;

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(maxLimit)
      .lean();

    res.status(200).json({
      success: true,
      data: leads
    });
  } catch (error) {
    next(error);
  }
};
