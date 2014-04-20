function DBController($scope, $resource) {
	//display page sorting
	$scope.currentPage = 0;
	$scope.pageOffset = 0;
    $scope.pageSize = 10;
    $scope.predicateSort = "entity_name";
    $scope.reverseSort = false;
    //search form variables
    $scope.IZHBinary = true;
    $scope.IZHParams = ["", "", "", "", "", "", ""];
    $scope.HHBinary = true;
    $scope.NCSBinary = true;
    $scope.HHVGIBinary = true;
    $scope.HHVGIParams = [ ["","","","","",""] , ["","","","","",""] ,"","", "", ""];// Alpha, Beta, Power, X-Initial, Conductance, Reversal Potential
    $scope.LIFVGIBinary = true;
    $scope.LIFVGIParams = ["","","","","","","",""]; //VHalf, 
    $scope.LIFCDBinary = true;
    $scope.LIFCDParams = ["","","","","","",""]; //VHalf, 
    $scope.nameFilter = "";
    $scope.detailsFilter = "";
    $scope.authorFilter = "";

    //----------------model display handlers---------------------------------------------------------------------
  	//compute the number of pages of models based on the total models
    $scope.numberOfPages=function(){
        return Math.ceil($scope.dbdisplay.length/$scope.pageSize);                
    }
    $scope.goToPage=function(go){
		if(go < 0 || go >= $scope.numberOfPages())
			return;//out of bounds
		$scope.currentPage = go;
	    if ($scope.currentPage < 7)
			$scope.pageOffset = 0;
		else if($scope.currentPage > $scope.numberOfPages()-8)
		{
			tmp = $scope.currentPage-16;
			if($tmp < 0)
				$scope.pageOffset = 0;
			else
				$scope.pageOffset = tmp;
		}
		else
			$scope.pageOffset = $scope.currentPage-7;                
    }
	//filter model database by types of models
	$scope.filterModels = function () {
		var tmp = [];
		//check each model/channel type
		for (var i=0; i<$scope.dbmodels.length; i++)
		{
			if($scope.dbmodels[i].specification.type == "hh_voltage_gated_ion") //includes particles
			{
                //////
                // TODO : Alpha and Beta Parameter Filters
                //////
				if($scope.HHVGIBinary == true)
				{
					if($scope.HHVGIParams[2] == ""  && $scope.HHVGIParams[3] == "" && $scope.HHVGIParams[0] == "" && $scope.HHVGIParams[1] == "")
                        tmp.push($scope.dbmodels[i]);					
					else//test filter
					{
                        
                        ////////////////////////
                        // POWER            ////
                        ////////////////////////
						if($scope.HHVGIParams[2].search("-") == -1 && $scope.HHVGIParams[2] != "")//single value filter
						{
							if(parseFloat($scope.HHVGIParams[2]) != null)
							{//okay to filter	
								$scope.HHVGIParams[2] = ""+parseFloat($scope.HHVGIParams[2]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.particles.power != parseFloat($scope.HHVGIParams[2]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[2] = "";//clear garbage
						}
						else if($scope.HHVGIParams[2].search("-") != -1 && $scope.HHVGIParams[2] != "")//range value filter
						{
							var range = $scope.HHVGIParams[2].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.HHVGIParams[2] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.particles.power < parseFloat(range[0]) || 
								$scope.dbmodels[i].specification.particles.power > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[2] = "";//clear garbage
						}
                        ////////////////////////
                        // X-Initial        ////
                        ////////////////////////
						if($scope.HHVGIParams[3].search("-") == -1 && $scope.HHVGIParams[3] != "")//single value filter
						{
							if(parseFloat($scope.HHVGIParams[3]) != null)
							{//okay to filter	
								$scope.HHVGIParams[3] = ""+parseFloat($scope.HHVGIParams[3]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.particles.x_initial != parseFloat($scope.HHVGIParams[3]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[3] = "";//clear garbage
						}
						else if($scope.HHVGIParams[3].search("-") != -1 && $scope.HHVGIParams[3] != "")//range value filter
						{
							var range = $scope.HHVGIParams[3].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.HHVGIParams[3] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.particles.x_initial < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.particles.x_initial > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[3] = "";//clear garbage
						}
                        
                        ////////////////////////
                        // Conductance      ////
                        ////////////////////////
                        if($scope.HHVGIParams[4].search("-") == -1 && $scope.HHVGIParams[4] != "")//single value filter
						{
							if(parseFloat($scope.HHVGIParams[4]) != null)
							{//okay to filter	
								$scope.HHVGIParams[4] = ""+parseFloat($scope.HHVGIParams[4]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.conductance != parseFloat($scope.HHVGIParams[4]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[4] = "";//clear garbage
						}
						else if($scope.HHVGIParams[4].search("-") != -1 && $scope.HHVGIParams[4] != "")//range value filter
						{
							var range = $scope.HHVGIParams[4].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.HHVGIParams[4] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.conductance < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.conductance > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[4] = "";//clear garbage
						}
                         
                        ////////////////////////
                        // Reversal Potential //
                        ////////////////////////
                        if($scope.HHVGIParams[5].search("-") == -1 && $scope.HHVGIParams[5] != "")//single value filter
						{
							if(parseFloat($scope.HHVGIParams[5]) != null)
							{//okay to filter	
								$scope.HHVGIParams[5] = ""+parseFloat($scope.HHVGIParams[5]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.reversal_potential != parseFloat($scope.HHVGIParams[5]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[5] = "";//clear garbage
						}
						else if($scope.HHVGIParams[5].search("-") != -1 && $scope.HHVGIParams[5] != "")//range value filter
						{
							var range = $scope.HHVGIParams[5].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.HHVGIParams[5] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.reversal_potential < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.reversal_potential > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.HHVGIParams[5] = "";//clear garbage
						}
                        
                        ///////////////////////////
                        // End Of filters!      ///
                        ///////////////////////////
                        
						//made it this far! passed all filters!
						tmp.push($scope.dbmodels[i]);
					}
				}
				//else false
			}
			else if($scope.dbmodels[i].specification.type == "lif_voltage_gated_ion")
			{
				if($scope.LIFVGIBinary == true)
                {
                    if( $scope.LIFVGIParams[0] == "" && $scope.LIFVGIParams[1] == "" && $scope.LIFVGIParams[2] == "" && $scope.LIFVGIParams[3] == "" && $scope.LIFVGIParams[4] == "" && $scope.LIFVGIParams[5] == "" && $scope.LIFVGIParams[6] == "" && $scope.LIFVGIParams[7] == "")
                        tmp.push($scope.dbmodels[i]);
                    
                    else
                    {
                        ////////////////////////
                        // V Half           ////
                        ////////////////////////
                        if($scope.LIFVGIParams[0].search("-") == -1 && $scope.LIFVGIParams[0] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[0]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[0] = ""+parseFloat($scope.LIFVGIParams[0]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.v_half != parseFloat($scope.LIFVGIParams[0]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[0] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[0].search("-") != -1 && $scope.LIFVGIParams[0] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[0].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[0] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.v_half < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.v_half > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[0] = "";//clear garbage
                        }
                        
                        ////////////////////////
                        // Transition Rate  ////
                        ////////////////////////
                        if($scope.LIFVGIParams[1].search("-") == -1 && $scope.LIFVGIParams[1] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[1]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[1] = ""+parseFloat($scope.LIFVGIParams[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.r != parseFloat($scope.LIFVGIParams[1]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[1] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[1].search("-") != -1 && $scope.LIFVGIParams[1] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[1].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[1] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.r < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.r> parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[1] = "";//clear garbage
                        }
                        
                        ////////////////////////
                        // Activation Slope ////
                        ////////////////////////
                        if($scope.LIFVGIParams[2].search("-") == -1 && $scope.LIFVGIParams[2] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[2]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[2] = ""+parseFloat($scope.LIFVGIParams[2]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.activation_slope != parseFloat($scope.LIFVGIParams[2]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[2] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[2].search("-") != -1 && $scope.LIFVGIParams[2] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[2].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[2] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.activation_slope < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.activation_slope > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[2] = "";//clear garbage
                        }
                        
                        ////////////////////////
                        // DeActivation Slope //
                        ////////////////////////
                        if($scope.LIFVGIParams[3].search("-") == -1 && $scope.LIFVGIParams[3] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[3]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[3] = ""+parseFloat($scope.LIFVGIParams[3]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.deactivation_slope != parseFloat($scope.LIFVGIParams[3]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[3] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[3].search("-") != -1 && $scope.LIFVGIParams[3] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[3].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[3] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.deactivation_slope < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.deactivation_slope > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[3] = "";//clear garbage
                        }
                        
                        
                        ////////////////////////
                        //Equilibrium Slope ////
                        ////////////////////////
                        if($scope.LIFVGIParams[4].search("-") == -1 && $scope.LIFVGIParams[4] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[4]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[4] = ""+parseFloat($scope.LIFVGIParams[4]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.equilibrium_slope != parseFloat($scope.LIFVGIParams[4]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[4] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[4].search("-") != -1 && $scope.LIFVGIParams[4] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[4].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[4] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.equilibrium_slope < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.equilibrium_slope > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[4] = "";//clear garbage
                        }
                        
                        ////////////////////////
                        // Conductance      ////
                        ////////////////////////
                        if($scope.LIFVGIParams[5].search("-") == -1 && $scope.LIFVGIParams[5] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[5]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[5] = ""+parseFloat($scope.LIFVGIParams[5]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.conductance != parseFloat($scope.LIFVGIParams[5]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[5] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[5].search("-") != -1 && $scope.LIFVGIParams[5] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[5].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[5] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.conductance < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.conductance > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[5] = "";//clear garbage
                        }
                        
                        
                        //////////////////////////
                        // Reversal Potential ////
                        //////////////////////////
                        if($scope.LIFVGIParams[6].search("-") == -1 && $scope.LIFVGIParams[6] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[6]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[6] = ""+parseFloat($scope.LIFVGIParams[0]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.reversal_potential != parseFloat($scope.LIFVGIParams[6]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[6] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[6].search("-") != -1 && $scope.LIFVGIParams[6] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[6].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[6] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.reversal_potential < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.reversal_potential > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[6] = "";//clear garbage
                        }
                        
                        ////////////////////////
                        // M Initial        ////
                        ////////////////////////
                        if($scope.LIFVGIParams[7].search("-") == -1 && $scope.LIFVGIParams[7] != "")//single value filter
                        {
                            if(parseFloat($scope.LIFVGIParams[7]) != null )
                            {//okay to filter	
                                $scope.LIFVGIParams[7] = ""+parseFloat($scope.LIFVGIParams[7]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.m_initial != parseFloat($scope.LIFVGIParams[7]))
                                    continue;//filtered OUT, does not match
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[7] = "";//clear garbage
                        }
                        else if($scope.LIFVGIParams[7].search("-") != -1 && $scope.LIFVGIParams[7] != "")//range value filter
                        {
                            var range = $scope.LIFVGIParams[7].split("-");
                            if(parseFloat(range[0]) && parseFloat(range[1]))
                            {//okay to filter
                                $scope.LIFVGIParams[7] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                if($scope.dbmodels[i].specification.m_initial < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.m_initial > parseFloat(range[1]))
                                    continue;//filtered OUT, does not fit in range
                                //else, continue
                            }
                            else//is garbage, don't filter
                                $scope.LIFVGIParams[7] = "";//clear garbage
                        }
                    }
                }
				//else false

			}
			else if($scope.dbmodels[i].specification.type == "lif_calcium_dependant")
			{
				if($scope.LIFCDBinary == true)
                {
					if($scope.LIFCDParams[2] == ""  && $scope.LIFCDParams[3] == "" && $scope.LIFCDParams[0] == "" && $scope.LIFCDParams[1] == "" && $scope.LIFCDParams[4] == "" && $scope.LIFCDParams[5] == "" && $scope.LIFCDParams[6] == ""  && $scope.LIFCDParams[7] == "")
                        tmp.push($scope.dbmodels[i]);					
					else//test filter
					{
                        
                        ////////////////////////
                        // M Initial        ////
                        ////////////////////////
						if($scope.LIFCDParams[0].search("-") == -1 && $scope.LIFCDParams[0] != "")//single value filter
						{
							if(parseFloat($scope.LIFCDParams[0]) != null)
							{//okay to filter	
								$scope.LIFCDParams[0] = ""+parseFloat($scope.LIFCDParams[0]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.m_initial != parseFloat($scope.LIFCDParams[0]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.LIFCDParams[0] = "";//clear garbage
						}
						else if($scope.LIFCDParams[0].search("-") != -1 && $scope.LIFCDParams[0] != "")//range value filter
						{
							var range = $scope.LIFCDParams[0].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.LIFCDParams[0] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.m_initial < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.m_initial > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.LIFCDParams[0] = "";//clear garbage
						}
						
                        ////////////////////////
                        // Reversal Potential //
                        ////////////////////////
						if($scope.LIFCDParams[1].search("-") == -1 && $scope.LIFCDParams[1] != "")//single value filter
						{
							if(parseFloat($scope.LIFCDParams[1]) != null)
							{//okay to filter	
								$scope.LIFCDParams[1] = ""+parseFloat($scope.LIFCDParams[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.reversal_potential != parseFloat($scope.LIFCDParams[1]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.LIFCDParams[1] = "";//clear garbage
						}
						else if($scope.LIFCDParams[1].search("-") != -1 && $scope.LIFCDParams[1] != "")//range value filter
						{
							var range = $scope.LIFCDParams[1].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.LIFCDParams[1] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.reversal_potential < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.reversal_potential > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.LIFCDParams[1] = "";//clear garbage
						}
                        
                        
                         ////////////////////////
                         // Conductance      ////
                         ////////////////////////
                         if($scope.LIFCDParams[2].search("-") == -1 && $scope.LIFCDParams[2] != "")//single value filter
                         {
                         if(parseFloat($scope.LIFCDParams[2]) != null)
                         {//okay to filter	
                         $scope.LIFCDParams[2] = ""+parseFloat($scope.LIFCDParams[4]);//cleans up in the event some is garbage
                         if($scope.dbmodels[i].specification.conductance != parseFloat($scope.LIFCDParams[2]))
                         continue;//filtered OUT, does not match
                         //else, continue
                         }
                         else//is garbage, don't filter
                         $scope.LIFCDParams[2] = "";//clear garbage
                         }
                         else if($scope.LIFCDParams[2].search("-") != -1 && $scope.LIFCDParams[2] != "")//range value filter
                         {
                         var range = $scope.LIFCDParams[2].split("-");
                         if(parseFloat(range[0]) && parseFloat(range[1]))
                         {//okay to filter
                         $scope.LIFCDParams[2] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                         if($scope.dbmodels[i].specification.conductance < parseFloat(range[0]) || 
                         $scope.dbmodels[i].specification.conductance > parseFloat(range[1]))
                         continue;//filtered OUT, does not fit in range
                         //else, continue
                         }
                         else//is garbage, don't filter
                         $scope.LIFCDParams[2] = "";//clear garbage
                         }
                         
                        
                         ////////////////////////
                         // Backwards Rate     //
                         ////////////////////////
                         if($scope.LIFCDParams[3].search("-") == -1 && $scope.LIFCDParams[3] != "")//single value filter
                         {
                             if(parseFloat($scope.LIFCDParams[3]) != null)
                             {//okay to filter	
                                 $scope.LIFCDParams[3] = ""+parseFloat($scope.LIFCDParams[3]);//cleans up in the event some is garbage
                                 if($scope.dbmodels[i].specification.backwards_rate != parseFloat($scope.LIFCDParams[3]))
                                 continue;//filtered OUT, does not match
                         //else, continue
                             }
                             else//is garbage, don't filter
                                 $scope.LIFCDParams[3] = "";//clear garbage
                         }
                         else if($scope.LIFCDParams[3].search("-") != -1 && $scope.LIFCDParams[3] != "")//range value filter
                         {
                             var range = $scope.LIFCDParams[3].split("-");
                             if(parseFloat(range[0]) && parseFloat(range[1]))
                             {//okay to filter
                                 $scope.LIFCDParams[3] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
                                 if($scope.dbmodels[i].specification.backwards_rate < parseFloat(range[0]) || 
                                    $scope.dbmodels[i].specification.backwards_rate > parseFloat(range[1]))
                                     continue;//filtered OUT, does not fit in range
                         //else, continue
                             }
                             else//is garbage, don't filter
                                 $scope.LIFCDParams[3] = "";//clear garbage
                         }
                          
                        
                        ///////////////////////////
                        // End Of filters!      ///
                        ///////////////////////////
                        
						//made it this far! passed all filters!
						tmp.push($scope.dbmodels[i]);
					}                }
				//else false
			}
            else if($scope.dbmodels[i].specification.type == "izhikevich")
			{
				if($scope.IZHBinary == true)
                {
                    if($scope.IZHParams[2] == ""  && $scope.IZHParams[3] == "" && $scope.IZHParams[0] == "" && $scope.IZHParams[1] == "" && $scope.IZHParams[4] == "" && $scope.IZHParams[5] == "" && $scope.IZHParams[6] == "")
                        tmp.push($scope.dbmodels[i]);					
					else//test filter
					{
                        
                        ////////////////////////
                        // A                ////
                        ////////////////////////
						if($scope.IZHParams[0].search("-") == -1 && $scope.IZHParams[0] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[0]) != null)
							{//okay to filter	
								$scope.IZHParams[0] = ""+parseFloat($scope.IZHParams[0]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.a != parseFloat($scope.IZHParams[0]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[0] = "";//clear garbage
						}
						else if($scope.IZHParams[0].search("-") != -1 && $scope.IZHParams[0] != "")//range value filter
						{
							var range = $scope.IZHParams[0].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[0] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.a < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.a > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[0] = "";//clear garbage
						}
                        
                        
                        ////////////////////////
                        // B                ////
                        ////////////////////////
						if($scope.IZHParams[1].search("-") == -1 && $scope.IZHParams[1] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[1]) != null)
							{//okay to filter	
								$scope.IZHParams[1] = ""+parseFloat($scope.IZHParams[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.b != parseFloat($scope.IZHParams[1]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[1] = "";//clear garbage
						}
						else if($scope.IZHParams[1].search("-") != -1 && $scope.IZHParams[1] != "")//range value filter
						{
							var range = $scope.IZHParams[1].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[1] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.b < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.b > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[1] = "";//clear garbage
						}
                        
                        
                        ////////////////////////
                        // C                ////
                        ////////////////////////
						if($scope.IZHParams[2].search("-") == -1 && $scope.IZHParams[2] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[2]) != null)
							{//okay to filter	
								$scope.IZHParams[2] = ""+parseFloat($scope.IZHParams[2]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.c != parseFloat($scope.IZHParams[2]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[2] = "";//clear garbage
						}
						else if($scope.IZHParams[2].search("-") != -1 && $scope.IZHParams[2] != "")//range value filter
						{
							var range = $scope.IZHParams[2].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[2] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.c < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.c > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[2] = "";//clear garbage
						}
                        
                        
                        ////////////////////////
                        // D                ////
                        ////////////////////////
						if($scope.IZHParams[3].search("-") == -1 && $scope.IZHParams[3] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[3]) != null)
							{//okay to filter	
								$scope.IZHParams[3] = ""+parseFloat($scope.IZHParams[3]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.d != parseFloat($scope.IZHParams[3]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[3] = "";//clear garbage
						}
						else if($scope.IZHParams[3].search("-") != -1 && $scope.IZHParams[3] != "")//range value filter
						{
							var range = $scope.IZHParams[3].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[3] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.d < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.d > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[3] = "";//clear garbage
						}
                        
                        
                        
                        ////////////////////////
                        // U                ////
                        ////////////////////////
						if($scope.IZHParams[4].search("-") == -1 && $scope.IZHParams[4] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[4]) != null)
							{//okay to filter	
								$scope.IZHParams[4] = ""+parseFloat($scope.IZHParams[4]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.u != parseFloat($scope.IZHParams[4]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[4] = "";//clear garbage
						}
						else if($scope.IZHParams[4].search("-") != -1 && $scope.IZHParams[4] != "")//range value filter
						{
							var range = $scope.IZHParams[4].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[4] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.u < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.u > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[4] = "";//clear garbage
						}
                        
                        
                        
                        ////////////////////////
                        // V                ////
                        ////////////////////////
						if($scope.IZHParams[5].search("-") == -1 && $scope.IZHParams[5] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[5]) != null)
							{//okay to filter	
								$scope.IZHParams[5] = ""+parseFloat($scope.IZHParams[5]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.v != parseFloat($scope.IZHParams[5]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[5] = "";//clear garbage
						}
						else if($scope.IZHParams[5].search("-") != -1 && $scope.IZHParams[5] != "")//range value filter
						{
							var range = $scope.IZHParams[5].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[5] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.v < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.v > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[5] = "";//clear garbage
						}
                        
                        
                        
                        ////////////////////////
                        // Threshold        ////
                        ////////////////////////
						if($scope.IZHParams[6].search("-") == -1 && $scope.IZHParams[6] != "")//single value filter
						{
							if(parseFloat($scope.IZHParams[6]) != null)
							{//okay to filter	
								$scope.IZHParams[6] = ""+parseFloat($scope.IZHParams[6]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.threshold != parseFloat($scope.IZHParams[6]))
									continue;//filtered OUT, does not match
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[6] = "";//clear garbage
						}
						else if($scope.IZHParams[6].search("-") != -1 && $scope.IZHParams[6] != "")//range value filter
						{
							var range = $scope.IZHParams[6].split("-");
							if(parseFloat(range[0]) && parseFloat(range[1]))
							{//okay to filter
								$scope.IZHParams[6] = ""+parseFloat(range[0])+"-"+parseFloat(range[1]);//cleans up in the event some is garbage
								if($scope.dbmodels[i].specification.threshold < parseFloat(range[0]) || 
                                   $scope.dbmodels[i].specification.threshold > parseFloat(range[1]))
									continue;//filtered OUT, does not fit in range
								//else, continue
							}
							else//is garbage, don't filter
								$scope.IZHParams[6] = "";//clear garbage
						}
                        //else false
                        
                        
                        ///////////////////////////
                        // End Of filters!      ///
                        ///////////////////////////
                        
						//made it this far! passed all filters!
						tmp.push($scope.dbmodels[i]);
                    }
                }
			}
            else if($scope.dbmodels[i].specification.type == "hh")
			{
				if($scope.HHBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}            
            else if($scope.dbmodels[i].specification.type == "ncs")
			{
				if($scope.NCSBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}
            else if($scope.dbmodels[i].specification.type == "rectangular_current") //Stimulus
			{
				if($scope.RCStimBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}
            else if($scope.dbmodels[i].entity_type == "synapse" && $scope.dbmodels[i].specification.type == "flat")
			{
				if($scope.SFBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}
            else if($scope.dbmodels[i].entity_type == "synapse" && $scope.dbmodels[i].specification.type == "ncs")
			{
				if($scope.SNCSBinary == true)
					tmp.push($scope.dbmodels[i]);
				//else false
			}

		}		
		$scope.dbsecondary = tmp;
		$scope.filterModelsByString();
	}  
	//filter (already filtered by type) models by general string filters for a final search product
	$scope.filterModelsByString = function () {
		var tmp = [];
		for (var i=0; i<$scope.dbsecondary.length; i++)
		{
			if( (($scope.nameFilter == "") || ($scope.dbsecondary[i].entity_name.search($scope.nameFilter) != -1)) &&
			(($scope.authorFilter == "") || ($scope.dbsecondary[i].author.search($scope.authorFilter) != -1)) &&
			(($scope.detailsFilter == "") || ($scope.dbsecondary[i].description.search($scope.detailsFilter) != -1)) )
				tmp.push($scope.dbsecondary[i]);
			//else does not match
		}	
		$scope.dbdisplay = tmp;
	} 

    //This is for getting all models
    var DBModels = $resource('/dbmodels');
    $scope.dbmodels = [];//all models
    $scope.dbsecondary = [];//models from dbmodels that match up with types and ranges
    $scope.dbdisplay = [];//models from dbsecondary that match up with name, author, and description filters
    //----------------model update handlers---------------------------------------------------------------------
    //loads all models from the server and updates the scopes
    function updateDBModels() {
        DBModels.query({}, function (result) {
            $scope.dbmodels = result;
            $scope.filterModels();
        });
    }
    //delete a model and update the display
    $scope.deleteDBModel = function (dbmodelname) {
        dbmodels.remove({ dbmodelname: dbmodelname });
        $scope.filterModels();
    }
        
    //create a new model and save as a new record if it doesn't exist, or update if it does
    //this is probably done by NCB, but can still tweak to have it work to promote or alter existing models.
    $scope.addUpdateDBModel = function () {
        var dbmodel = new DBModel({
            dbmodelname: $scope.dbmodelname,
        });
        dbmodel.$save();
        updateDBModels();
    };
    
    $scope.showDetails = function(model) {
		$scope.selectedModel = model;
		$scope.hasPromoted();
	}
 
     $scope.hideDetails = function() {
		$scope.selectedModel = 0;
	}
	
    $scope.promoteModel = function() {
		if(!$scope.selectedModel)
			alert("No model has been selected.");
		var formData = new FormData();
		formData.append("sessionID", SessionID);
		formData.append("logged", Logged);
		finished = false;
		request = $.ajax({
			url: "/promote/"+$scope.selectedModel._id.$oid,
			type: "POST",
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
			{
				$scope.selectedModel = response.update;
				$scope.filterModels();
				$scope.hasPromoted();
				alert("Model promoted!");			
			}	
			else
				alert("Model promotion failed: "+response.error);
		});		
		request.fail(function(jqXHR, textStatus, error) {
			alert("Unexpected error in model promotion:" + error);
		});
	}

    $scope.demoteModel = function() {
		finished = false;
		$scope.selectedModel = model;
		formData.append("sessionID", SessionID);
		formData.append("logged", Logged);

		request = $.ajax({
			url: "/demote/"+$scope.selectedModel,
			type: "POST",
			data: 0,
			cache: false,
			contentType: false,
			processData: false
		});
		request.done(function(response, textStatus, jqXHR) {
			if(response.success)
			{
				$scope.selectedModel = response.update;
				$scope.filterModels();
				$scope.hasPromoted();
				alert("Model demoted.");	
			}			
			else
				alert("Model demotion failed: "+response.error);
		});		
		request.fail(function(jqXHR, textStatus, error) {
			alert("Unexpected error in model demotion:" + error);
		});
	}
	
	$scope.hasPromoted = function()
	{
		//no model selected
		if(!$scope.selectedModel)
			return 0;
		if( $scope.selectedModel.votes && $scope.selectedModel.votes.indexOf(Logged) != -1)
			$scope.promoted = 1;//found
		else
			$scope.promoted = 0;//not found
	}
	
	$scope.canEdit = function() 
	{
		//no model selected
		if(!$scope.selectedModel)
			return 0;
		//must be admin or author
		if (Rank == "admin" || Logged == $scope.selectedModel.author_id)
			return 1;
		else
			return 0;
	}
    
    //get the models outright
    updateDBModels();
}
